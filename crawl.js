var fs = require('fs');
var axios = require('axios')
var https = require('https')
var cheerio = require('cheerio')
var qs = require('qs')

var instance = axios.create({
  httpsAgent: new https.Agent({
    ciphers: 'DES-CBC3-SHA'
   }),
})

var schools = [
  {
    name: 'ESA - 藝術高等學校',
    code: 2,
    programs: [
      {code: 'LD', name: '綜合設計學士學位補充課程 (LD)', result: []},
      {code: 'LDN', name: '綜合設計學士學位補充課程 (LDN)', result: []},
      {code: 'LVE', name: '視覺藝術(教育專業)', result: []},
      {code: '4LVEDC', name: '視覺藝術學士學位課程 (4LVEDC)', result: []},
      {code: '4LDDC', name: '設計學士學位課程 (4LDDC)', result: []},
      {code: '4LDNC', name: '設計學士學位課程 (4LDNC)', result: []},
      {code: '4LUEDC', name: '音樂學士學位課程 (4LUEDC)', result: []},
    ]
  },
  {
    name: 'ESLT - 語言暨翻譯高等學校',
    code: 3,
    programs: [
      {code: '4LLCID', name: '中英翻譯學士學位課程 (4LLCID)', result: []},
      {code: '4LLCIN', name: '中英翻譯學士學位課程 (4LLCIN)', result: []},
      {code: '4LLD-C', name: '中葡/葡中翻譯學士學位課程 (中、英文教育制度學生) (4LLD-C)', result: []},
      {code: '4LLN-C', name: '中葡/葡中翻譯學士學位課程 (中、英文教育制度學生) (4LLN-C)', result: []},
      {code: '4LLN-P', name: '中葡/葡中翻譯學士學位課程 (葡文教育制度學生) (4LLN-P)', result: []},
      {code: 'LL-IPL', name: '中葡翻譯課程 (LL-IPL)', result: []},
      {code: 'BY-CLP', name: '北京語言大學外語學院葡萄牙語專業二年級 (BY-CLP)', result: []},
      {code: '4LCD-C', name: '國際漢語教育學士學位課程(適用於漢語母語者) (4LCD-C)', result: []},
      {code: '4LCD-E', name: '國際漢語教育學士學位課程(適用於非漢語母語者) (4LCD-E)', result: []},
      {code: '4LPDP', name: '葡萄牙語學士學位課程 (4LPDP)', result: []},
    ]
  },
  {
    name: 'ESCE - 管理科學高等學校',
    code: 4,
    programs: [
      {code: '4LGRMDC', name: '工商管理學士學位課程（博彩與娛樂管理專業） (4LGRMDC)', result: []},
      {code: '4LGRMDI', name: '工商管理學士學位課程（博彩與娛樂管理專業） (4LGRMDI)', result: []},
      {code: '4LGRMNC', name: '工商管理學士學位課程（博彩與娛樂管理專業） (4LGRMNC)', result: []},
      {code: '4LMKTDI', name: '工商管理學士學位課程(市場學專業) (4LMKTDI)', result: []},
      {code: '4LPRNI', name: '文學士學位課程(公共關係專業) (4LPRNI)', result: []},
      {code: '4LACDI', name: '會計學學士學位課程 (4LACDI)', result: []},
      {code: '4LGRDC', name: '社會科學學士學位課程(博彩與娛樂管理專業) (4LGRDC)', result: []},
      {code: '4LGRNC', name: '社會科學學士學位課程(博彩與娛樂管理專業) (4LGRNC)', result: []},
      {code: '4LGDI', name: '管理學學士學位課程 (4LGDI)', result: []},
      {code: '4LGNI', name: '管理學學士學位課程 (4LGNI)', result: []},
      {code: '4LEDI', name: '電子商務學士學位課程 (4LEDI)', result: []},
    ]
  },
  {
    name: 'ESAP - 公共行政高等學校',
    code: 5,
    programs: [
      {code: '4LCPC', name: '中國與葡語系國家經貿關係學士學位課程 (4LCPC)', result: []},
      {code: '4LADC', name: '公共行政學學士學位課程 (4LADC)', result: []},
      {code: '4LANP', name: '公共行政學學士學位課程 (4LANP)', result: []},
      {code: 'LW', name: '社會工作學學士學位補充課程 (LW)', result: []},
      {code: '4LWDC', name: '社會工作學學士學位課程 (4LWDC)', result: []},
      {code: '4LWNC', name: '社會工作學學士學位課程 (4LWNC)', result: []},
      {code: '4LCDI', name: '電腦學學士學位課程 (4LCDI)', result: []},
    ]
  },
  {
    name: 'ESEFD - 體育暨運動高等學校',
    code: 6,
    programs: [
      {code: '4LFDC', name: '體育教育學士學位課程 (4LFDC)', result: []},
      {code: '4LFNC', name: '體育教育學士學位課程 (4LFNC)', result: []},
    ]
  },
  {
    name: 'ESS - 高等衛生學校',
    code: 7,
    programs: [
      {code: '4LBMADCI', name: '生物醫學技術理學士學位課程(檢驗技術) (4LBMADCI)', result: []},
      {code: '4LBMFDCI', name: '生物醫學技術理學士學位課程(藥劑技術) (4LBMFDCI)', result: []},
      {code: '4LTLDCI', name: '言語語言治療理學士學位課程 (4LTLDCI)', result: []},
      {code: '4LEGDCI', name: '護理學士學位課程 (4LEGDCI)', result: []},
      {code: '4LCEDCI', name: '護理學學士學位課程 (4LCEDCI)', result: []},
    ]
  }
]

var allAjaxFunc = {};
for (let x in schools) {
  for (let y in schools[x].programs) {
    allAjaxFunc['f' + schools[x].code + schools[x].programs[y].code] = ()=>{
      return instance.post('https://wapps.ipm.edu.mo/siweb/time_prog.asp', qs.stringify({
        p_escl_cod: schools[x].code, // 學院, 5-公共行政
        p_turno: '', // 日夜, 日間-'D', 夜間-'P', Both-''
        p_curso: schools[x].programs[y].code, // 課程,
        p_sp_year: '', // 年級 1~4
        p_ling: '', // 語言,
        p_year_sem: '2016/2017-2', // 年度/學期
        p_class_code: '', // 班別編號 22121,22221
        action: 'search',
        la: 'ch', // 語言 英文-'en', 中文-'ch'
      })).then((response)=>{
        $ = cheerio.load(response.data)

        var tables = $('table')
        var timeTable;
        var pregLength;

        for (var i=0; i<tables.length; i++) {
          if (tables[i]['attribs']['bordercolor'] === '#CCCCCC') {
            timeTable = tables[i]
            var trs = $(timeTable).children()[0]
            var classes = {}
          }
        }

        if (timeTable) {
          for (var i=0; i<$(trs).children().length; i++) {
            // 表格頭兩行尾兩行 skip
            if (i==0 || i==1 || i==$(trs).children().length-1 || i==$(trs).children().length-2) {
              continue
            }

            var tr = $(trs).children()[i]
            // console.log($(tr).children().length)
            // console.log($(tr).prev().children().length)
            // 6+3, 15+12 列
            // 如果 12 列，則與上一個 course 相同，
            // 如果 15 列，要判斷班別編號是否相同
            // 還有一個情況 12列 之前 沒有15
            if ($(tr).children().length == 6) {

            } else if ($(tr).children().length == 3) {

            } else if ($(tr).children().length == 15) {
              var codeRe = /([A-Z0-9]*)-([A-Z0-9]*)/g
              var dateRe = /(.*)-(.*)/g
              var timeRe = /(.*)-(.*)/g

              var year = +$($(tr).children()[0]).text().trim()

              var tmp = codeRe.exec($($(tr).children()[2]).text().trim())
              var classCode = tmp[2]
              var courseCode = tmp[1]

              var courseName = $($(tr).children()[3]).text().trim()
              var teacherName = $($(tr).children()[4]).text().trim()
              var roomNum = $($(tr).children()[5]).text().trim()

              var tmp = dateRe.exec($($(tr).children()[6]).text().trim())
              var startDate = $($(tr).children()[6]).text().trim()
              var endDate = ''
              if (tmp != null) {
                startDate = tmp[1]
                endDate = tmp[2]
              }

              var tmp = timeRe.exec($($(tr).children()[7]).text().trim())
              var startTime = tmp[1]
              var endTime = tmp[2]

              var days = []
              var nums = [8, 9, 10, 11, 12, 13, 14]
              for (var j in nums) {
                $($(tr).children()[nums[j]]).find('img').length > 0 && days.push(+j)
              }

              var course3 = {
                year: year,
                code: courseCode,
                name: courseName,
                teacher: teacherName,
                room: roomNum,
                startDate: startDate,
                endDate: endDate,
                startTime: startTime,
                endTime: endTime,
                days: days,
              }
              if (classes[classCode] == null) {
                classes[classCode] = {}
                classes[classCode]['courses'] = []
              }
              classes[classCode]['courses'].push(course3)
            } else if ($(tr).children().length == 12) {
              if ($(tr).prev().children().length == 6 || $(tr).prev().children().length == 3) {
                continue;
              }
              var dateRe = /(.*)-(.*)/g
              var timeRe = /(.*)-(.*)/g
              var teacherName = $($(tr).children()[1]).text().trim()
              var roomNum = $($(tr).children()[2]).text().trim()

              var tmp = dateRe.exec($($(tr).children()[3]).text().trim())
              var startDate = $($(tr).children()[3]).text().trim()
              var endDate = ''
              if (tmp != null) {
                startDate = tmp[1]
                endDate = tmp[2]
              }

              var tmp = timeRe.exec($($(tr).children()[4]).text().trim())
              var startTime = tmp[1]
              var endTime = tmp[2]

              var days = []
              var nums = [5, 6, 7, 8, 9, 10, 11]
              for (var j in nums) {
                $($(tr).children()[nums[j]]).find('img').length > 0 && days.push(+j)
              }

              if (course3 != null) {
                var course4 = {
                  year: course3.year,
                  code: course3.code,
                  name: course3.name,
                  teacher: teacherName,
                  room: roomNum,
                  startDate: startDate,
                  endDate: endDate,
                  startTime: startTime,
                  endTime: endTime,
                  days: days,
                }
                classes[classCode]['courses'].push(course4)
              }
            }
          }

          schools[x].programs[y].result = classes
          return;
        }

        console.log('nothing!')
        return;
      });
    }
  }
}

var allAjaxArray = Object.keys(allAjaxFunc).map(function (key) {
  return allAjaxFunc[key]()
});

axios.all(allAjaxArray).then(axios.spread(function (acct, perms) {
  // Both requests are now complete
  console.log('done!')
  fs.writeFileSync("result.json", JSON.stringify(schools));
}));
