const puppeteer = require('puppeteer');

async function autoApplyNaukri(email, password, keyword = "Frontend Developer", location = "Bangalore") {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.naukri.com/mnjuser/login', { waitUntil: 'networkidle2' });

    // Login
    await page.type('input[type="text"]', email, { delay: 50 });
    await page.type('input[type="password"]', password, { delay: 50 });
    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    console.log("Logged in");

    // Search Jobs
    await page.goto(`https://www.naukri.com/${keyword.replace(/ /g, '-')}-jobs-in-${location}`, { waitUntil: 'networkidle2' });

    const jobLinks = await page.$$eval('article div>a.title', anchors => anchors.map(a => a.href));

    console.log(`Found ${jobLinks.length} jobs`);

    for (let i = 0; i < Math.min(jobLinks.length, 5); i++) {
      await page.goto(jobLinks[i], { waitUntil: 'networkidle2' });
      try {
        const applyButton = await page.$('button[title="Apply"]');
        if (applyButton) {
          await applyButton.click();
          console.log(`Applied to: ${jobLinks[i]}`);
        } else {
          console.log(`No apply button found for: ${jobLinks[i]}`);
        }
      } catch (err) {
        console.error("Error clicking apply button", err);
      }
    }

  } catch (err) {
    console.error("Automation error:", err);
  } finally {
    await browser.close();
  }
}

module.exports = { autoApplyNaukri };
