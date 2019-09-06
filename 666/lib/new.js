const puppeteer = require('puppeteer');
const account = `17710133830`;
const password = `Apple314159`;

let result = [];

(async () => {
  const browser = await puppeteer.launch({
      headless: false,
      timeout: 30000, // 默认超时为30秒，设置为0则表示不设置超时
      defaultViewport: {
        width: 1200,
        height: 600
      }
  });//打开浏览器
  const page = await browser.newPage();//打开一个空白页
  await page.goto('https://www.kuaikanmanhua.com/webs/loginh');//打开豆瓣网站
  await page.type('.inputPhone input', account);    
  await page.type('.password input', password);
  await page.click('.loginhBtn');
  await page.waitForNavigation({
    waitUntil: 'load'
  });//等待页面加载出来，等同于window.onload
  await page.goto('https://www.kuaikanmanhua.com/web/topic/1033');//打开豆瓣网站
  // try {
  //   await page.click('.follow.btns.fl')
  // } catch(err) {
  //   console.log(err)
  // }
  // await page.hover('.avatar')
  // await page.click('.userPopup a.fr')

  const h5 = await browser.newPage();
  await h5.emulate({
    viewport: {
      width: 375,
      height: 667,
      isMobile: true
    },
    userAgent: '"Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"'
  })
  await h5.goto('https://m.kuaikanmanhua.com/mobile/1004/list');//打开豆瓣网站

  await h5.waitForSelector('.ChapterList');

  await h5.waitFor(1000);

  const chapterList = await h5.$$('.ChapterList')

  for (let n = 0; n < chapterList.length; n++) {
    let chapter = {}
    const l = await h5.$$('.ChapterList')
    // 获取章节名称
    const chapterName = await h5.evaluate((index) => document.querySelectorAll('.ChapterList')[index].querySelector('.chapterTitle').innerText, n)
    chapter.name = chapterName
    // 点击进入
    await l[n].click()

    await h5.waitForNavigation({
      waitUntil: 'load'
    });
    // await h5.screenshot({path: `${i}.png`})

    // 抓取评论
    const commentsList = await h5.$$('.reviewArea .review')
    let comments = []

    for (let m = 0; m < commentsList.length; m++) {
      // 获取评论内容
      const comment = await h5.evaluate((index) => document.querySelectorAll('.reviewArea .review')[index].querySelector('.message').innerText, m)
      // 获取评论时间
      const time = await h5.evaluate((index) => document.querySelectorAll('.reviewArea .review')[index].querySelector('.time').innerText, m)

      comments.push({
        time,
        comment
      })
    }
    chapter.comments = comments
    result.push(chapter)
  
    await h5.goBack()
    await h5.waitFor(500);
    await h5.waitForSelector('.ChapterList');
  }

  console.log(JSON.stringify(result))

  // await chapterList[0].click();

  // await h5.evaluate(() => {
  //   let list = document.querySelectorAll('.ChapterList')
  //   list[0].click()
  // });

  // const chapter = await (await chapterList[0].getProperty('innerText')).jsonValue();
  // console.log(chapter);

})();