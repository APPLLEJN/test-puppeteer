const request = require('superagent');
const requestProxy = require('superagent-proxy');
const userAgents = require('./lib/useragents.js');
const getProxyList = require('./lib/get_proxy_list.js');

requestProxy(request);

let proxyList = []

// start
doRequest()

async function doRequest() {

    let ip = null
    if (proxyList.length > 0) {
        ip = proxyList.shift();
    } else {
        proxyList = await getProxyList()
        return doRequest()
    }

    let userAgent = userAgents[parseInt(Math.random() * userAgents.length)];

    console.log(ip)

    request
        .get('http://123.57.21.57:8081/test')
        .set({ 'User-Agent': userAgent })
        .timeout({ response: 5000, deadline: 60000 })
        .proxy(`http://${ip}`)
        .end(async (err, res) => {
            // 处理数据
            if (err) {
                console.log(`爬取页面失败，${err}，正在重新寻找代理ip... ×`);
                // 如果是代理ip无法访问，另外选择一个代理
                doRequest();
                return;
            }
            // 解析html
            console.log('爬取页面  √');
        });
}

/**
 * 请求免费代理，读取redis，如果代理信息已经过期，重新请求免费代理请求
 */
// async function getProxyIp() {
//     // 先从redis读取缓存ip
//     // let localIpStr = await redisClient.getAsync('proxy_ips');
//     let localIpStr = null
//     let ips = null;
//     // 如果本地存在，则随机返回其中一个ip，否则重新请求
//     if (localIpStr) {
//       let localIps = localIpStr.split(',');
//       return localIps[parseInt(Math.random() * localIps.length)];
//     } else {
//         // console.log(await request.get('http://api.pcdaili.com/?orderid=888888888&num=100&protocol=1&method=1&an_ha=1&sp1=1&sp2=1&format=json&sep=1'))
//         // let ipsJson = (await request.get('http://api.pcdaili.com/?orderid=888888888&num=100&protocol=1&method=1&an_ha=1&sp1=1&sp2=1&format=json&sep=1')).body;
//         // console.log(ipsJson)
//         let list = 
        
//       // 将爬取结果存入本地，缓存时间10分钟
//     //   if (isRequestSuccess) {
//     //     redisClient.set('proxy_ips', ips.join(','), 'EX', 10 * 60);
//     //   }
//         return list
//     }
// }
