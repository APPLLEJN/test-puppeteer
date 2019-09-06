const puppeteer = require('puppeteer');
const account = `19801110201`;
const password = `1qaz2wsx`;
let i = 0;
let chapterList = null;
const chapterListFun = async (item, h5) => {
   if (item) {
      await item.click()
      await h5.waitForNavigation({
        waitUntil: 'load'
      });
      await h5.screenshot({path: `${i}.png`})
      i++
      await h5.goBack()
      await h5.waitForNavigation({
        waitUntil: 'load'
      });
      chapterList = await h5.$$('.ChapterList')
      await chapterListFun(chapterList[i], h5)
   }
  // await page.screenshot({path: 'example.png'});//截个图

  // await browser.close();//关掉浏览器
};


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
  try {
    await page.click('.follow.btns.fl')
  } catch(err) {
    console.log(err)
  }
  await page.hover('.avatar')
  await page.click('.userPopup a.fr')

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
  var chapterList = await h5.$$('.ChapterList')
  for (var i = 0; i < chapterList.length; i++) {
      const l = await h5.$$('.ChapterList') 
      await l[i].click()
      await h5.waitForNavigation({
        waitUntil: 'load'
      });
      await h5.screenshot({path: `${i}.png`})
      await h5.goBack({
        waitUntil: 'load'
      })
  }
})();