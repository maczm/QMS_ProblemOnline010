/* eslint-disable */
import { saveAs } from 'file-saver'//"file-saver": "^2.0.5",
// import XLSX from 'xlsx'
import XLSX from 'xlsx-style'//"xlsx-style": "^0.8.13"
function generateArray(table) {
    var out = [];
    var rows = table.querySelectorAll('tr');
    var ranges = [];
    for (var R = 0; R < rows.length; ++R) {
        var outRow = [];
        var row = rows[R];
        var columns = row.querySelectorAll('td');
        for (var C = 0; C < columns.length; ++C) {
            var cell = columns[C];
            var colspan = cell.getAttribute('colspan');
            var rowspan = cell.getAttribute('rowspan');
            var cellValue = cell.innerText;
            if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

            //Skip ranges
            ranges.forEach(function (range) {
                if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
                    for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
                }
            });

            //Handle Row Span
            if (rowspan || colspan) {
                rowspan = rowspan || 1;
                colspan = colspan || 1;
                ranges.push({
                    s: {
                        r: R,
                        c: outRow.length
                    },
                    e: {
                        r: R + rowspan - 1,
                        c: outRow.length + colspan - 1
                    }
                });
            };

            //Handle Value
            outRow.push(cellValue !== "" ? cellValue : null);

            //Handle Colspan
            if (colspan)
                for (var k = 0; k < colspan - 1; ++k) outRow.push(null);
        }
        out.push(outRow);
    }
    return [out, ranges];
};

function datenum(v, date1904) {
    if (date1904) v += 1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {
        s: {
            c: 10000000,
            r: 10000000
        },
        e: {
            c: 0,
            r: 0
        }
    };
    for (var R = 0; R != data.length; ++R) {
        for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            var cell = {
                v: data[R][C]
            };
            if (cell.v == null) continue;
            cell.w = { alignment: { wrapText: true } };//屏蔽自动换行
            var cell_ref = XLSX.utils.encode_cell({
                c: C,
                r: R
            });

            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            } else cell.t = 's';

            ws[cell_ref] = cell;
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

export function export_table_to_excel(id) {
    var theTable = document.getElementById(id);
    var oo = generateArray(theTable);
    var ranges = oo[1];

    /* original data */
    var data = oo[0];
    var ws_name = "SheetJS";

    var wb = new Workbook(),
        ws = sheet_from_array_of_arrays(data);

    /* add ranges to worksheet */
    // ws['!cols'] = ['apple', 'banan'];
    ws['!merges'] = ranges;

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'binary'
    });

    saveAs(new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    }), "test.xlsx")
}

export function export_json_to_excel({
    multiHeader = [],
    header,
    data,
    filename,
    hearerStyle = [], //头部样式
    merges = [],
    autoWidth = true,
    bookType = 'xlsx',
    setDateFormatForTwoColumns = false
} = {}) {
    /* original data */
    filename = filename || 'excel-list'
    data = [...data]
    data.unshift(header);

    for (let i = multiHeader.length - 1; i > -1; i--) {
        data.unshift(multiHeader[i])
    }

    var ws_name = "SheetJS";
    var wb = new Workbook(),
        ws = sheet_from_array_of_arrays(data);

    if (merges.length > 0) {
        if (!ws['!merges']) ws['!merges'] = [];
        merges.forEach(item => {
            ws['!merges'].push(XLSX.utils.decode_range(item))
        })
    }

    if (autoWidth) {
        // /*设置worksheet每列的最大宽度*/
        const colWidth = data.map(row => row.map(val => {
            /*先判断是否为null/undefined*/
            if (val == null) {
                return {
                    'wch': 10
                };
            }
            /*再判断是否为中文*/
            else if (val.toString().charCodeAt(0) > 255) {
                return {
                    'wch': val.toString().length * 2
                };
            } else {
                return {
                    'wch': val.toString().length
                };
            }
        }))
        /*以第一行为初始值*/
        let result = colWidth[0];
        for (let i = 1; i < colWidth.length; i++) {
            for (let j = 0; j < colWidth[i].length; j++) {
                if (result[j]['wch'] < colWidth[i][j]['wch']) {
                    result[j]['wch'] = colWidth[i][j]['wch'];
                }
            }
        }
        ws['!cols'] = result;
    }

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    var ws = wb.Sheets[ws_name];
    var cell_ref;
    var cell;
    var date_format = 'YYYY-MM-DD HH:MM:SS:sss'; // 自定义日期时间格式  

    for (let colIndex = 0; colIndex < (setDateFormatForTwoColumns ? 2 : 1); colIndex++) { // 根据参数设置第一列或前两列  
        for (let R = 0; R < data.length; ++R) {
            cell_ref = XLSX.utils.encode_cell({ c: colIndex, r: R });
            cell = ws[cell_ref];
            if (cell && cell.t === 'n' || cell.t === 'd') {
                if (cell.t === 'n' || cell.t === 'd') {
                    cell.z = date_format;
                    ws[cell_ref] = cell;
                }
            }
        }
    }


    var dataInfo = wb.Sheets[wb.SheetNames[0]];

    // 这是表头行的样式
    var tableTitleFont = {
        border: {
            top: {
                style: 'thin',
                color: { rgb: "ffffff" },
            },
            right: {
                style: 'thin',
                color: { rgb: "ffffff" },
            },
            bottom: {
                style: 'thin',
                color: { rgb: "ffffff" },
            },
            left: {
                style: 'thin',
                color: { rgb: "ffffff" },
            },
        },
        font: {
            sz: 12,
            color: { rgb: "ffffff" },
            bold: true,
        },
        alignment: {
            horizontal: "center",
            vertical: "center"
        },
        fill: {
            fgColor: { rgb: "017ede" },
        },
    };
    for (var i = 0; i < hearerStyle.length; i++) {
        dataInfo[hearerStyle[i]].s = tableTitleFont;
    }
    var wbout = XLSX.write(wb, {
        bookType: bookType,
        bookSST: true,
        type: 'binary'
    });
    saveAs(new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    }), `${filename}.${bookType}`);
}


// 代码用例
/* import('../Export/Export2Excel').then((excel) => {
    // 一级表头
    const multiHeader = [
        [
            '开始日期', '结束日期', 'URL', '状态码', '状态', '请求耗时', '输出', '输入'
        ],
    ]
    // 二级表头
    const tHeader = ['', '', '', '', '', '', '', '']
    // 对应数据属性
    const filterVal = ['startTime', 'endTime', 'URL', 'HTTPstatusCode', 'type', 'timeConsuming', 'InterfaceReturn', 'input'] // 数据属性
    var list = table3
    const merges = [
        'A1:A2', 'B1:B2', 'C1:C2', 'D1:D2', 'E1:E2', 'F1:F2', 'G1:G2', 'H1:H2'
    ] //需要合并的单元格
    const data = list.map((item) => filterVal.map((j) => item[j])) // 转换二维数组

    const filename = '接口日志' + time
    const hearerStyle = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2']
    excel.export_json_to_excel({
        multiHeader: multiHeader, // 一级表头
        header: tHeader, // 二级表头
        data: data, // 数据
        hearerStyle,
        filename: filename, // 导出excel的名称
        merges: merges, // 合并表格的数据
        autoWidth: true,
        bookType: 'xlsx',
        setDateFormatForTwoColumns: true
    })
}) */