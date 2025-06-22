// Global variables
let originalLatex = "";
let bulletPoints = [];
let bulletCounter = 0;
let currentReplacementBulletId = null;

// Replacement points loaded from JSON file
let replacementPoints = [];

// Load replacement points from JSON file or localStorage
async function loadReplacementPoints() {
    try {
        // First, try to load from localStorage
        const stored = localStorage.getItem('latexReplacementPoints');
        if (stored) {
            replacementPoints = JSON.parse(stored);
            console.log('✅ Replacement points loaded from localStorage:', replacementPoints.length, 'points');
            return;
        }

        // If not in localStorage, load from JSON file
        const response = await fetch('replacement-points.json');
        if (!response.ok) {
            throw new Error(`Failed to load replacement-points.json: ${response.status}`);
        }
        
        replacementPoints = await response.json();
        console.log('✅ Replacement points loaded from replacement-points.json:', replacementPoints.length, 'points');
        
        // Save to localStorage for future use
        saveReplacementPoints();
        
    } catch (error) {
        console.error('❌ Error loading replacement points:', error);
        replacementPoints = [];
        console.log('⚠️ No replacement points available');
    }
}

// Save replacement points to localStorage
function saveReplacementPoints() {
    try {
        localStorage.setItem('latexReplacementPoints', JSON.stringify(replacementPoints));
        console.log('✅ Replacement points saved to localStorage');
        return true;
    } catch (error) {
        console.error('❌ Error saving replacement points to localStorage:', error);
        return false;
    }
}

// Auto-load on page load
window.addEventListener("load", async function () {
    await loadReplacementPoints();
    setTimeout(() => {
        loadMainTexFile();
    }, 500);
});

// File upload handler
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("latexFile").addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                originalLatex = e.target.result;
                document.getElementById("latexEditor").value = originalLatex;
                extractBulletPoints();
                showStatus("File loaded successfully!", "success");
            };
            reader.readAsText(file);
        }
    });
});

// Load main.tex file from same directory (static version)
async function loadMainTexFile() {
    try {
        showStatus("Loading main.tex...", "loading");
        const response = await fetch('main.tex');
        
        if (!response.ok) {
            throw new Error('main.tex file not found in the same directory');
        }
        
        const content = await response.text();
        originalLatex = content;
        document.getElementById("latexEditor").value = content;
        extractBulletPoints();
        showStatus("main.tex loaded successfully!", "success");
    } catch (error) {
        showStatus(`Error loading main.tex: ${error.message}. Try using "Upload Different LaTeX File" instead.`, "error");
        console.error("Error loading main.tex:", error);
    }
}

function extractBulletPoints() {
    // First, find the Experience section boundaries
    const experienceSectionMatch = originalLatex.match(
        /\\section\{Experience\}(.*?)(?=\\section\{|\\end\{document\})/s,
    );

    if (!experienceSectionMatch) {
        showStatus(
            "No Experience section found in the LaTeX file.",
            "error",
        );
        return;
    }

    const experienceSection = experienceSectionMatch[1];
    const experienceSectionStart =
        experienceSectionMatch.index +
        experienceSectionMatch[0].indexOf(experienceSection);

    // Extract job experiences with company names from the experience section only
    const experienceRegex =
        /\\resumeSubheading\s*\{([^}]+)\}\s*\{([^}]+)\}\s*\{([^}]+)\}\s*\{([^}]+)\}/gs;
    const experiences = [
        ...experienceSection.matchAll(experienceRegex),
    ];

    // Extract bullet points only from the experience section
    const resumeItemRegex =
        /\\resumeItem\{((?:[^{}]|\\[{}]|{[^}]*})*)\}/gs;
    let matches = [...experienceSection.matchAll(resumeItemRegex)];

    bulletPoints = matches.map((match, index) => {
        // Find which job section this bullet belongs to by checking position within experience section
        const bulletPosition = match.index;
        let assignedJob = "General";
        let assignedCompany = "Unknown Company";

        // Find the closest preceding job heading within the experience section
        for (let i = experiences.length - 1; i >= 0; i--) {
            if (experiences[i].index < bulletPosition) {
                assignedJob = experiences[i][1]; // Job title
                assignedCompany = experiences[i][3]; // Company name
                break;
            }
        }

        // Create the full match string for replacement (need to find it in the original document)
        const fullMatchInOriginal = originalLatex.indexOf(
            match[0],
            experienceSectionStart,
        );

        return {
            id: ++bulletCounter,
            original: match[1].trim(),
            modified: match[1].trim(),
            index: index,
            jobTitle: assignedJob,
            companyName: assignedCompany,
            fullMatch: match[0], // Store the full \resumeItem{...} for replacement
            globalIndex: fullMatchInOriginal, // Store position in original document
        };
    });

    renderBulletPoints();
}

function renderBulletPoints() {
    const container = document.getElementById("bulletPointsList");
    container.innerHTML = "";

    // Group bullets by company name
    const groupedBullets = bulletPoints.reduce((groups, bullet) => {
        const company = bullet.companyName || "General";
        if (!groups[company]) groups[company] = [];
        groups[company].push(bullet);
        return groups;
    }, {});

    // Define company order and styling
    const companyOrder = [
        "Atlas of Behavior Change in Development",
        "Aurigo Software Technologies",
    ];

    const companyColors = {
        "Atlas of Behavior Change in Development":
            "linear-gradient(135deg, #27ae60, #2ecc71)",
        "Aurigo Software Technologies":
            "linear-gradient(135deg, #e74c3c, #c0392b)",
        General: "linear-gradient(135deg, #95a5a6, #7f8c8d)",
    };

    // Render companies in order
    companyOrder.forEach((company) => {
        if (groupedBullets[company]) {
            renderCompanySection(
                container,
                company,
                groupedBullets[company],
                companyColors[company],
            );
            delete groupedBullets[company]; // Remove so we don't render twice
        }
    });

    // Render any remaining companies
    Object.keys(groupedBullets).forEach((company) => {
        renderCompanySection(
            container,
            company,
            groupedBullets[company],
            companyColors["General"],
        );
    });
}

function renderCompanySection(container, companyName, bullets, backgroundColor) {
    // Create company section header
    const companyHeader = document.createElement("div");
    companyHeader.style.cssText = `
    background: ${backgroundColor};
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    margin: 25px 0 15px 0;
    font-weight: 700;
    font-size: 16px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 10px;
`;
    companyHeader.innerHTML = `🏢 ${companyName} <span style="font-size: 12px; opacity: 0.8; font-weight: normal;">(${bullets.length} bullet${bullets.length !== 1 ? "s" : ""})</span>`;
    container.appendChild(companyHeader);

    // Add company-specific "Add New Bullet Point" button
    const addBulletBtn = document.createElement("button");
    addBulletBtn.className = "btn btn-add";
    addBulletBtn.style.cssText = `
        margin: 10px 0 20px 10px;
        font-size: 12px;
        padding: 8px 12px;
    `;
    addBulletBtn.textContent = `+ Add New Bullet for ${companyName}`;
    addBulletBtn.onclick = () => addBulletPointForCompany(companyName);
    container.appendChild(addBulletBtn);

    // Add bullets for this company
    bullets.forEach((bullet, index) => {
        const bulletDiv = document.createElement("div");
        bulletDiv.className = "bullet-point";
        bulletDiv.style.marginLeft = "10px"; // Indent under company header
        bulletDiv.innerHTML = `
        <div style="font-size: 12px; color: #666; margin-bottom: 5px; font-weight: 500;">
            📝 ${bullet.jobTitle} - Bullet ${index + 1}
        </div>
        <textarea class="bullet-input" style="min-height: 80px; resize: vertical; font-size: 13px; line-height: 1.4;"
                 onchange="updateBulletPoint(${bullet.id}, this.value)">${bullet.modified}</textarea>
        <div class="bullet-actions">
            <button class="btn btn-remove" onclick="removeBulletPoint(${bullet.id})">Remove</button>
            <button class="btn btn-replace" onclick="openReplacementModal(${bullet.id})">Replace</button>
        </div>
    `;
        container.appendChild(bulletDiv);
    });
}

function addBulletPointForCompany(companyName) {
    // Find a job title for this company from existing bullets
    const existingBullet = bulletPoints.find(b => b.companyName === companyName);
    const jobTitle = existingBullet ? existingBullet.jobTitle : "New Entry";
    
    const newBullet = {
        id: ++bulletCounter,
        original: "",
        modified: "New bullet point - customize this text",
        index: bulletPoints.length,
        jobTitle: jobTitle,
        companyName: companyName,
    };
    bulletPoints.push(newBullet);
    renderBulletPoints();
}

function updateBulletPoint(id, newValue) {
    const bullet = bulletPoints.find((b) => b.id === id);
    if (bullet) {
        bullet.modified = newValue;
    }
}

function removeBulletPoint(id) {
    bulletPoints = bulletPoints.filter((b) => b.id !== id);
    renderBulletPoints();
}

function openReplacementModal(bulletId) {
    currentReplacementBulletId = bulletId;
    const modal = document.getElementById('replacementModal');
    const pointsList = document.getElementById('replacementPointsList');
    
    // Clear existing content
    pointsList.innerHTML = '';
    
    // Add replacement points
    replacementPoints.forEach((point, index) => {
        const pointDiv = document.createElement('div');
        pointDiv.className = 'replacement-point';
        pointDiv.textContent = point;
        pointDiv.onclick = () => selectReplacementPoint(point);
        pointsList.appendChild(pointDiv);
    });
    
    modal.style.display = 'block';
}

function closeReplacementModal() {
    document.getElementById('replacementModal').style.display = 'none';
    currentReplacementBulletId = null;
}

function selectReplacementPoint(newText) {
    if (currentReplacementBulletId) {
        const bullet = bulletPoints.find(b => b.id === currentReplacementBulletId);
        if (bullet) {
            bullet.modified = newText;
            renderBulletPoints();
        }
    }
    closeReplacementModal();
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const replacementModal = document.getElementById('replacementModal');
    const latexViewerModal = document.getElementById('latexViewerModal');
    
    if (event.target === replacementModal) {
        closeReplacementModal();
    } else if (event.target === latexViewerModal) {
        closeLatexViewerModal();
    }
}

function getModifiedLatex() {
    let modifiedLatex = document.getElementById("latexEditor").value;

    // Replace bullet points in the LaTeX using the full \resumeItem format
    bulletPoints.forEach((bullet) => {
        if (bullet.fullMatch) {
            // Replace the full \resumeItem{...} with the modified content
            const newResumeItem = `\\resumeItem{${bullet.modified}}`;
            modifiedLatex = modifiedLatex.replace(
                bullet.fullMatch,
                newResumeItem,
            );
        }
    });

    // Add new bullet points if they don't exist in original
    const newBullets = bulletPoints.filter((b) => !b.original);
    if (newBullets.length > 0) {
        const newBulletLatex = newBullets
            .map((b) => `        \\resumeItem{${b.modified}}`)
            .join("\n");
        // Try to find the last resumeItemListEnd and add before it
        if (modifiedLatex.includes("\\resumeItemListEnd")) {
            const lastItemListEnd = modifiedLatex.lastIndexOf(
                "\\resumeItemListEnd",
            );
            modifiedLatex =
                modifiedLatex.slice(0, lastItemListEnd) +
                newBulletLatex +
                "\n\n      " +
                modifiedLatex.slice(lastItemListEnd);
        } else {
            modifiedLatex +=
                "\n\n% New bullet points:\n" + newBulletLatex;
        }
    }

    return modifiedLatex;
}

function viewLatexFile() {
    try {
        const viewBtn = document.getElementById("viewLatexBtn");
        viewBtn.disabled = true;
        viewBtn.textContent = "⏳ Preparing...";

        showPdfStatus("Generating LaTeX content...", "loading");
        const modifiedLatex = getModifiedLatex();

        // Display the LaTeX code in the modal
        document.getElementById("latexCodeDisplay").textContent = modifiedLatex;
        document.getElementById("latexViewerModal").style.display = "block";

        showPdfStatus("✅ LaTeX code ready for viewing and copying!", "success");
    } catch (error) {
        showPdfStatus(`Error generating LaTeX code: ${error.message}`, "error");
    } finally {
        const viewBtn = document.getElementById("viewLatexBtn");
        viewBtn.disabled = false;
        viewBtn.textContent = "👁️ View LaTeX Code";
    }
}

function closeLatexViewerModal() {
    document.getElementById("latexViewerModal").style.display = "none";
}

async function copyLatexToClipboard() {
    try {
        const latexCode = document.getElementById("latexCodeDisplay").textContent;
        await navigator.clipboard.writeText(latexCode);
        
        const copyBtn = document.getElementById("copyLatexBtn");
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "✅ Copied!";
        copyBtn.style.background = "linear-gradient(135deg, #28a745, #20c997)";
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = "linear-gradient(135deg, #28a745, #20c997)";
        }, 2000);
        
        showPdfStatus("✅ LaTeX code copied to clipboard!", "success");
    } catch (error) {
        showPdfStatus("❌ Failed to copy to clipboard. Please select and copy manually.", "error");
        console.error("Clipboard error:", error);
    }
}

function downloadLatexFromViewer() {
    try {
        const latexCode = document.getElementById("latexCodeDisplay").textContent;
        const tempLatexName = "temp_resume.tex";
        const blob = new Blob([latexCode], {
            type: "text/plain",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = tempLatexName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showPdfStatus(`✅ LaTeX file "${tempLatexName}" downloaded!`, "success");
    } catch (error) {
        showPdfStatus(`Error downloading LaTeX file: ${error.message}`, "error");
    }
}

function showStatus(message, type) {
    const statusDiv = document.getElementById("status");
    statusDiv.className = `status ${type}`;
    statusDiv.textContent = message;

    if (type !== "loading") {
        setTimeout(() => {
            statusDiv.className = "";
            statusDiv.textContent = "";
        }, 3000);
    }
}

function showPdfStatus(message, type) {
    const statusDiv = document.getElementById("pdfStatus");
    statusDiv.className = `status ${type}`;
    statusDiv.textContent = message;

    if (type !== "loading") {
        setTimeout(() => {
            statusDiv.className = "";
            statusDiv.textContent = "";
        }, 5000);
    }
}

// Replacement points management functions
function addReplacementPoint(newPoint) {
    if (newPoint && newPoint.trim()) {
        replacementPoints.push(newPoint.trim());
        saveReplacementPoints();
        return true;
    }
    return false;
}

function editReplacementPoint(index, newText) {
    if (index >= 0 && index < replacementPoints.length && newText && newText.trim()) {
        replacementPoints[index] = newText.trim();
        saveReplacementPoints();
        return true;
    }
    return false;
}

function deleteReplacementPoint(index) {
    if (index >= 0 && index < replacementPoints.length) {
        replacementPoints.splice(index, 1);
        saveReplacementPoints();
        return true;
    }
    return false;
}

// Open management modal
function openReplacementPointsManager() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 90%; max-width: 800px; max-height: 80vh;">
            <div class="modal-header">
                <h3>🔧 Manage Replacement Points</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div style="padding: 20px; max-height: 60vh; overflow-y: auto;">
                <div style="margin-bottom: 20px;">
                    <h4>Add New Replacement Point:</h4>
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <textarea id="newReplacementPoint" placeholder="Enter new replacement point..." 
                                style="flex: 1; min-height: 60px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;"></textarea>
                        <button onclick="addNewReplacementPoint()" 
                                style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            Add
                        </button>
                    </div>
                </div>
                
                <div>
                    <h4>Existing Replacement Points (${replacementPoints.length}):</h4>
                    <div id="replacementPointsList">
                        ${replacementPoints.map((point, index) => `
                            <div style="margin-bottom: 15px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
                                <div style="display: flex; align-items: flex-start; gap: 10px;">
                                    <span style="min-width: 30px; color: #666; font-weight: bold;">${index + 1}.</span>
                                    <textarea id="point-${index}" style="flex: 1; min-height: 60px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">${point}</textarea>
                                    <div style="display: flex; flex-direction: column; gap: 5px;">
                                        <button onclick="updateReplacementPoint(${index})" 
                                                style="padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                                            Save
                                        </button>
                                        <button onclick="deleteReplacementPointItem(${index})" 
                                                style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Management functions for the UI
function addNewReplacementPoint() {
    const textarea = document.getElementById('newReplacementPoint');
    const newPoint = textarea.value.trim();
    
    if (newPoint) {
        if (addReplacementPoint(newPoint)) {
            textarea.value = '';
            // Refresh the modal
            document.querySelector('.modal').remove();
            openReplacementPointsManager();
        }
    } else {
        alert('Please enter a replacement point');
    }
}

function updateReplacementPoint(index) {
    const textarea = document.getElementById(`point-${index}`);
    const newText = textarea.value.trim();
    
    if (newText) {
        if (editReplacementPoint(index, newText)) {
            alert('Replacement point updated successfully!');
        }
    } else {
        alert('Replacement point cannot be empty');
    }
}

function deleteReplacementPointItem(index) {
    if (confirm('Are you sure you want to delete this replacement point?')) {
        if (deleteReplacementPoint(index)) {
            // Refresh the modal
            document.querySelector('.modal').remove();
            openReplacementPointsManager();
        }
    }
} 