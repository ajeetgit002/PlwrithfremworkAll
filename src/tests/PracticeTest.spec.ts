import{test, expect} from '@fixtures/test.fixture';
import{Browser,BrowserContext, Page, chromium} from '@playwright/test';


test.describe.skip('Practice Test (Private Intranet Portal)', () => {

        let browser: Browser;
    let context: BrowserContext;
    let page: Page;


test.beforeEach('should open the browser and navigate to the login page', async () => {

 browser = await chromium.launch({ headless: false, slowMo: 50 });
   


 context = await browser.newContext();

page = await context.newPage();

await page.goto('https://demo-iserve.cats4u.ai:30038/uat_test/web/pages/UI.php');

await page.getByPlaceholder('User Name').fill('Admin');
await page.getByPlaceholder('Password').fill('Admin@123');

await page.getByRole('button', { name: 'Enter CATS' }).click();

});

test('Create incident ticket', async()=>{

const breadcrumb = page.locator('.breadcrumb-item.breadcrumb-current');

await expect(breadcrumb).toBeVisible();
await expect(breadcrumb).toHaveText('Welcome');

    await page.getByText('Incident Management').click();

    await page.getByText('New incident').click();

    const incidentFormHeading= page.getByRole('heading', { name: ' Creation of a new Incident' });
expect(incidentFormHeading).toBeVisible();
expect(incidentFormHeading).toHaveText('Creation of a new Incident');

await page.locator('select[name="attr_org_id"]').selectOption({label:'In2IT'});

const caller = page.locator('#label_2_caller_id');

await caller.click();

await caller.pressSequentially('Ajeet Yadav', {
    delay: 100
});
await page.getByText('Ajeet Yadav', {
    exact: true
}).click();



const titleBox = await page.locator('input[name="attr_title"]');

await titleBox.click();
await titleBox.pressSequentially('Test incident', {
    delay: 100
});


const descriptionBox = page
    .frameLocator('iframe[title="Rich Text Editor, 2_description"]')
    .locator('body[contenteditable="true"]');

await descriptionBox.click();
await descriptionBox.pressSequentially('Test incident description');


await page.locator('select[name="attr_service_id"]').selectOption({label:'Docker'});

await page.locator('select[name="attr_servicesubcategory_id"]').selectOption({label:'maintain docker'});

const urgencyDropdown = page.locator(
    'select[name="attr_urgency"]'
);

const options = await urgencyDropdown
    .locator('option')
    .allTextContents();

console.log('Urgency options:', options);

await urgencyDropdown.selectOption({
    label: 'critical'
});
await page.getByRole('button', {
    name: 'New',
    exact: true
}).first().click();


})




});