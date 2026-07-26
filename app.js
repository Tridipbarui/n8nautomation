// ===============================
// LeadPilot AI - app.js
// ===============================

// Replace with your webhook URL
const WEBHOOK_URL = "https://tridip02.app.n8n.cloud/workflow/9GX5Uaynq5F4hcXO";

let leadData = null;
let pageHistory = [];
const pageStartTime = Date.now();

// -------------------------------
// Load Random Lead from JSON
// -------------------------------
async function loadLead() {
    try {
        const response = await fetch("data/leads.json");

        if (!response.ok) {
            throw new Error("Unable to load leads.json");
        }

        const data = await response.json();

        const leads = data.sampleLeads;

        leadData = leads[Math.floor(Math.random() * leads.length)];

        console.log("Loaded Lead:");
        console.table(leadData);

    } catch (err) {
        console.error(err);
    }
}

loadLead();


// -------------------------------
// Track Page Visit
// -------------------------------
function trackPage(pageName) {

    pageHistory.push({
        page: pageName,
        visitedAt: new Date().toISOString()
    });

    console.log("Visited:", pageName);

}

trackPage("Home");


// -------------------------------
// Device Detection
// -------------------------------
function getDeviceType() {

    if (/mobile/i.test(navigator.userAgent))
        return "Mobile";

    if (/tablet/i.test(navigator.userAgent))
        return "Tablet";

    return "Desktop";
}


// -------------------------------
// Browser Detection
// -------------------------------
function getBrowser() {

    const ua = navigator.userAgent;

    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Edge")) return "Edge";

    return "Unknown";
}


// -------------------------------
// OS Detection
// -------------------------------
function getOS() {

    const ua = navigator.userAgent;

    if (ua.includes("Windows"))
        return "Windows";

    if (ua.includes("Mac"))
        return "macOS";

    if (ua.includes("Linux"))
        return "Linux";

    if (ua.includes("Android"))
        return "Android";

    if (ua.includes("iPhone"))
        return "iOS";

    return "Unknown";
}


// -------------------------------
// Button Tracking
// -------------------------------
document.querySelectorAll("button").forEach(btn => {

    btn.addEventListener("click", () => {

        trackPage(btn.innerText);

    });

});


// -------------------------------
// Submit Lead
// -------------------------------
async function sendLead() {

    if (!leadData) {

        alert("Lead data not loaded.");

        return;

    }

    const payload = {

        ...leadData,

        analytics: {

            pageHistory,

            totalTimeSeconds: Math.floor(
                (Date.now() - pageStartTime) / 1000
            ),

            browser: getBrowser(),

            device: getDeviceType(),

            os: getOS(),

            language: navigator.language,

            screen: `${screen.width}x${screen.height}`,

            referrer: document.referrer || "Direct",

            submittedAt: new Date().toISOString()

        }

    };

    console.log("Payload");
    console.log(payload);

    try {

        const response = await fetch(WEBHOOK_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)

        });

        const result = await response.text();

        console.log(result);

        alert("Lead sent successfully!");

    }

    catch (err) {

        console.error(err);

        alert("Webhook failed.");

    }

}


// -------------------------------
// Contact Button
// -------------------------------
const contactBtn = document.querySelector("#contact button");

if (contactBtn) {

    contactBtn.addEventListener("click", sendLead);

}


// -------------------------------
// Auto Track Links
// -------------------------------
document.querySelectorAll("nav a").forEach(link => {

    link.addEventListener("click", () => {

        trackPage(link.innerText);

    });

});


// -------------------------------
// Leave Page Event
// -------------------------------
window.addEventListener("beforeunload", () => {

    console.log("Session End");

    console.table(pageHistory);

});
