import {test,expect, request} from '@playwright/test';

test('Network Monitoring - Capture and log network requests', async ({page}) => {
    // Start monitoring network requests
    page.on('request', request => {
        console.log(`Incoming Request: ${request.method()} ${request.url()}`);
    });

    page.on('response', response => {
        console.log(`<< ${response.status()} ${response.url()}`);
    });

    // Navigate to a sample page
    await page.goto('https://naveenautomationlabs.com/opencart/index.php?route=common/home');

    // Perform some actions that trigger network requests
    await page.getByRole('link', { name: 'iPhone' }).first().click();

    // Wait for a while to capture network activity
    await page.waitForTimeout(5000);
});
