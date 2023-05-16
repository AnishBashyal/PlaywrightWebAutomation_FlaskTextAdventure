import { test, expect } from '@playwright/test';

test.setTimeout(600000)

var random_win , random_lose, leaf_count
async function create_user(page, username, password) {
    await page.getByRole('link', { name: 'Register' }).click();
    await page.fill('#username',username);
    await page.fill('#password',password);
    await page.fill('#confirm_password',password);
    await page.click("#submit");
    // await page.getByRole('link', { name: 'Login' }).click();
    await page.fill('#username',username);
    await page.fill('#password',password);
    await page.click("#submit");

}

async function create_story(page, title, theme) {
    await page.getByRole('link', { name: 'Create Story' }).click();
    await page.fill('#title',title);
    await page.fill('#theme',theme);
    await page.click("#submit");
}

async function build_story(page, tree_depth, story, option) {
    await page.fill('#story',story);
    await page.click("#submit");
    
    leaf_count+= tree_depth === 0
    if (tree_depth === 0 && (leaf_count == random_win || leaf_count == random_lose)) {
        const id = leaf_count === random_win ? '0' : '1'
        await page.click('id=is_last-'+id)
        await page.click('#submit') 
    }
    

    for (let i = 0; i < tree_depth; i++) {
        await page.fill('id=0-option', option);
        await page.click('id=0-submit');
        await page.getByRole('link', { name: 'Next' }).nth(i).click();
        await build_story(page, tree_depth-1, story, option)
        await page.click('#prev') 
    }
}


test('populate database', async ({ page }) => {
    const username = "jimmy"
    const password = "jimmy"
    const tree_depth = 3
    let no_of_stories = 1
    const title = "Lorem Ipsum"
    const theme = "Lora"
    const story = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu dignissim leo. Sed dui dolor, venenatis at volutpat mollis, tristique at ligula."
    const option = "lorem"
    leaf_count = 0
    random_win = randomize(tree_depth)
    random_lose = randomize(tree_depth)
    await page.goto('localhost:5000');
    await create_user(page, username, password)

    while(no_of_stories--) {
        await create_story(page,title, theme)
        await build_story(page, tree_depth, story, option)
        console.log("No of leafs, random win and lose ", leaf_count, random_win, random_lose)
    }
    
});

function randomize(n) {
    return Math.floor(Math.random() * factorial(n)) +1;

}

function factorial(x) {
    return (x > 1) ? x * factorial(x-1) : 1;
  }