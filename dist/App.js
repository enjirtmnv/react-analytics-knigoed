var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import React from "react";
// import Table from "./views/TableBook";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
// import { useRef, useState } from 'react';
function App() {
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var _b = useState([]), data = _b[0], setData = _b[1];
    var _c = useState([]), header = _c[0], setHeader = _c[1];
    var _d = useState(true), isSort = _d[0], setIsSort = _d[1];
    var _e = useState(""), searchAuthor = _e[0], setSearchAuthor = _e[1];
    var _f = useState(""), searchSeries = _f[0], setSearchSeries = _f[1];
    var _g = useState("Бренд"), inputFocus = _g[0], setInputFocus = _g[1];
    var _h = useState(""), filterFocus = _h[0], setFilterFocus = _h[1];
    var handleLoadingChange = function () {
        console.log(loading);
    };
    // useEffect(() => {
    //     console.log("loading", loading);
    // }, [loading]);
    var handleInputAuthor = function (e) {
        setInputFocus("Автор");
        setFilterFocus(e.target.value);
        setSearchAuthor(e.target.value);
    };
    var handleInputSeries = function (e) {
        setInputFocus("Серия");
        setFilterFocus(e.target.value);
        setSearchSeries(e.target.value);
    };
    var mySort = function (arr) {
        var wow = arr.sort(function (a, b) {
            if (a["Бренд"] < b["Бренд"]) {
                return -1;
            }
            if (a["Бренд"] > b["Бренд"]) {
                return 1;
            }
            return 0;
        });
        var wow2 = wow.sort(function (a, b) {
            if (a["Бренд"] === b["Бренд"]) {
                if (a["Наименование"] < b["Наименование"]) {
                    return -1;
                }
                if (a["Наименование"] > b["Наименование"]) {
                    return 1;
                }
                return 0;
            }
        });
        var wow3 = wow2.sort(function (a, b) {
            if (a["Бренд"] === b["Бренд"] &&
                a["Наименование"] === b["Наименование"]) {
                if (a["Год"] < b["Год"]) {
                    return -1;
                }
                if (a["Год"] > b["Год"]) {
                    return 1;
                }
                return 0;
            }
        });
        return wow3;
    };
    function myGroup(array) {
        var _a;
        var myArr = [];
        var myObj = {};
        for (var i = 0; i < array.length; i++) {
            var brand = array[i]["Бренд"] + array[i]["Наименование"] + array[i]["Год"];
            if (myObj[brand]) {
                myObj[brand].push(array[i]);
            }
            else {
                myObj[brand] = [array[i]];
            }
        }
        for (var _i = 0, _b = Object.values(myObj); _i < _b.length; _i++) {
            var value = _b[_i];
            myArr.push((_a = {},
                _a["Бренд"] = value[0]["Бренд"],
                _a["Наименование"] = value[0]["Наименование"],
                _a["Год"] = value[0]["Год"],
                _a["Автор"] = value[0]["Автор"],
                _a["Серия"] = value[0]["Серия"],
                _a["Языки"] = value[0]["Языки"],
                _a["Артикул продавца"] = value[0]["Артикул продавца"],
                _a["Заказали шт."] = value[0]["Заказали шт."],
                _a["Поступления шт."] = value.reduce(function (res, val) { return res + val["Поступления шт."]; }, 0),
                _a["Выкупили, шт."] = value.reduce(function (res, val) { return res + val["Выкупили, шт."]; }, 0),
                _a["Сумма заказов минус комиссия WB, руб."] = value
                    .reduce(function (res, val) {
                    return res + val["Сумма заказов минус комиссия WB, руб."];
                }, 0)
                    .toFixed(2),
                _a["Текущий остаток, шт."] = value.reduce(function (res, val) { return res + val["Текущий остаток, шт."]; }, 0),
                _a["К перечислению за товар, руб."] = value
                    .reduce(function (res, val) {
                    return res + val["К перечислению за товар, руб."];
                }, 0)
                    .toFixed(2),
                _a["Список дубликатов"] = value,
                _a["Дубликаты"] = value.length,
                _a["Предмет"] = value[0]["Предмет"],
                _a.key = uuidv4(),
                _a));
        }
        return myArr;
    }
    var handleFile = function (e) {
        e.preventDefault();
        var files = e.target.files;
        if (files && files[0]) {
            var reader = new FileReader();
            reader.onloadstart = function () {
                // console.log("start");
                setLoading(true);
            };
            reader.onloadend = function () {
                // console.log("end");
                setLoading(false);
            };
            reader.onload = function (e) {
                if (e.target) {
                    var bstr = e.target.result;
                    var wb = XLSX.read(bstr, { type: "binary" });
                    var sheetName = wb.SheetNames[0];
                    var ws = wb.Sheets[sheetName];
                    var headerTable = XLSX.utils.sheet_to_json(ws, {
                        header: 1,
                    })[0];
                    var dataTable = XLSX.utils.sheet_to_json(ws, {
                        header: 2,
                    });
                    var headerTableNew = ["Дубликаты"].concat(__spreadArray([], headerTable, true));
                    var newDataTable = myGroup(mySort(dataTable));
                    setData(newDataTable);
                    setHeader(headerTableNew);
                }
            };
            reader.readAsBinaryString(files[0]);
        }
    };
    // const filteredData = () => {
    //   if (searchSeries && searchAuthor) {
    //     const newData = data.filter((item) => {
    //       return item["Автор"].toLowerCase().includes(searchAuthor.toLowerCase());
    //     });
    //     return newData.filter((item) => {
    //       return item["Серия"].toLowerCase().includes(searchSeries.toLowerCase());
    //     });
    //   }
    //   return data.filter((item) => {
    //     return item[inputFocus].toLowerCase().includes(filterFocus.toLowerCase());
    //   });
    // };
    var _j = useState(""), searchText = _j[0], setSearchText = _j[1];
    var _k = useState(""), searchedColumn = _k[0], setSearchedColumn = _k[1];
    var searchInput = useRef(null);
    var handleSearch = function (selectedKeys, dataIndex) {
        // console.log('МММММММММ',searchText, searchedColumn, searchInput);
        // confirm();
        // console.log("selectedKeys", selectedKeys);
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    var handleReset = function (clearFilters) {
        clearFilters();
        setSearchText("");
    };
    var getColumnSearchProps = function (dataIndex) { return ({
        filterDropdown: function (_a) {
            var setSelectedKeys = _a.setSelectedKeys, selectedKeys = _a.selectedKeys, confirm = _a.confirm, clearFilters = _a.clearFilters, close = _a.close;
            return (_jsxs("div", __assign({ style: { padding: 8 }, onKeyDown: function (e) { return e.stopPropagation(); } }, { children: [_jsx(Input, { ref: function (el) {
                            // console.log('REFFF',el);
                            searchInput.current = el;
                        }, placeholder: "Search ".concat(dataIndex), value: selectedKeys[0], onChange: function (e) {
                            console.log(selectedKeys);
                            // setSearchText(selectedKeys[0])
                            setSelectedKeys(e.target.value ? [e.target.value] : []);
                        }, onPressEnter: function () { return confirm(); }, style: { marginBottom: 8, display: "block" } }), _jsxs(Space, { children: [_jsx(Button, __assign({ type: "primary", onClick: function () { return confirm(); }, icon: _jsx(SearchOutlined, {}), size: "small", style: { width: 90 } }, { children: "Search" })), _jsx(Button, __assign({ onClick: function () {
                                    return clearFilters && handleReset(clearFilters);
                                }, size: "small", style: { width: 90 } }, { children: "Reset" })), _jsx(Button, __assign({ type: "link", size: "small", onClick: function () {
                                    close();
                                } }, { children: "close" }))] })] })));
        },
        filterIcon: function (filtered) { return (_jsx(SearchOutlined, { style: { color: filtered ? "#1890ff" : undefined } })); },
        onFilter: function (value, record) {
            var _a;
            console.log("record", record[dataIndex], value);
            return (_a = record[dataIndex]) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase().includes(value.toLowerCase());
        },
        onFilterDropdownOpenChange: function (visible) {
            //   if (visible) {
            //     setTimeout(() => searchInput.current?.select(), 100);
            //   }
        },
        render: function (text) {
            return (_jsx(Highlighter, { highlightStyle: { backgroundColor: "#ffc069", padding: 0 }, searchWords: [searchText], autoEscape: true, textToHighlight: text ? text.toString() : "" }));
        },
    }); };
    useEffect(function () {
        console.log("AAAAAAAA", searchText, searchedColumn, searchInput);
    }, [searchText, searchedColumn, searchInput]);
    // useEffect(() => {
    //     console.log('searchInput', searchInput);
    // }, [searchInput])
    var columns3 = [
        {
            title: "Дубликаты",
            dataIndex: "Дубликаты",
            sorter: function (a, b) { return a["Дубликаты"] - b["Дубликаты"]; },
            key: uuidv4(),
            // fixed: 'left',
        },
        {
            title: "Текущий остаток, шт.",
            dataIndex: "Текущий остаток, шт.",
            sorter: function (a, b) {
                return a["Текущий остаток, шт."] - b["Текущий остаток, шт."];
            },
            key: uuidv4(),
        },
        {
            title: "К перечислению за товар, руб.",
            dataIndex: "К перечислению за товар, руб.",
            sorter: function (a, b) {
                return a["К перечислению за товар, руб."] -
                    b["К перечислению за товар, руб."];
            },
            key: uuidv4(),
        },
        {
            title: "Поступления шт.",
            dataIndex: "Поступления шт.",
            sorter: function (a, b) {
                return a["Поступления шт."] - b["Поступления шт."];
            },
            key: uuidv4(),
        },
        {
            title: "Выкупили, шт.",
            dataIndex: "Выкупили, шт.",
            sorter: function (a, b) { return a["Выкупили, шт."] - b["Выкупили, шт."]; },
            key: uuidv4(),
        },
        {
            title: "Заказали, шт.",
            dataIndex: "Заказали, шт.",
            sorter: function (a, b) { return a["Заказали, шт."] - b["Заказали, шт."]; },
            key: uuidv4(),
        },
        {
            title: "Сумма заказов минус комиссия WB, руб.",
            dataIndex: "Сумма заказов минус комиссия WB, руб.",
            sorter: function (a, b) {
                return a["Сумма заказов минус комиссия WB, руб."] -
                    b["Сумма заказов минус комиссия WB, руб."];
            },
            key: uuidv4(),
            // fixed: 'right',
        },
        {
            title: "Бренд",
            dataIndex: "Бренд",
            key: uuidv4(),
        },
        {
            title: "Наименование",
            dataIndex: "Наименование",
            key: uuidv4(),
            // fixed: 'left',
        },
        {
            title: "Год",
            dataIndex: "Год",
            key: uuidv4(),
        },
        {
            title: "Автор",
            dataIndex: "Автор",
            key: uuidv4(),
        },
        {
            title: "Серия",
            dataIndex: "Серия",
            key: uuidv4(),
        },
        {
            title: "Языки",
            dataIndex: "Языки",
            key: uuidv4(),
        },
        {
            title: "Артикул продавца",
            dataIndex: "Артикул продавца",
            key: uuidv4(),
        },
        {
            title: "Предмет",
            dataIndex: "Предмет",
            key: uuidv4(),
        },
    ];
    var columns = header.map(function (item) {
        if (item === "Дубликаты") {
            return {
                title: item,
                dataIndex: item,
                sorter: function (a, b) { return b[item] - a[item]; },
                key: uuidv4(),
            };
        }
        if (item === "Бренд") {
            return __assign({ title: item, dataIndex: item, key: uuidv4() }, getColumnSearchProps(item));
        }
        if (item === "Предмет") {
            return {
                title: item,
                dataIndex: item,
                filters: [
                    { text: "Книги", value: "Книги" },
                    { text: "Букинистика", value: "Букинистические книги" },
                ],
                onFilter: function (value, record) {
                    return record[item].includes(value);
                },
                key: uuidv4(),
            };
        }
        if (item === "Наименование") {
            return __assign({ title: item, dataIndex: item, key: uuidv4() }, getColumnSearchProps(item));
        }
        if (item === "Артикул продавца") {
            return __assign({ title: item, dataIndex: item, key: uuidv4() }, getColumnSearchProps(item));
        }
        if (item === "Автор") {
            return __assign({ title: item, dataIndex: item, key: uuidv4() }, getColumnSearchProps(item));
        }
        if (item === "Год") {
            return __assign({ title: item, dataIndex: item, key: uuidv4() }, getColumnSearchProps(item));
        }
        if (item === "Серия") {
            return __assign({ title: item, dataIndex: item, key: uuidv4() }, getColumnSearchProps(item));
        }
        if (item === "Поступления шт.") {
            return {
                title: item,
                dataIndex: item,
                sorter: function (a, b) { return b[item] - a[item]; },
                key: uuidv4(),
            };
        }
        if (item === "Заказали шт.") {
            return {
                title: item,
                dataIndex: item,
                sorter: function (a, b) { return b[item] - a[item]; },
                key: uuidv4(),
            };
        }
        if (item === "Сумма заказов минус комиссия WB, руб.") {
            return {
                title: item,
                dataIndex: item,
                sorter: function (a, b) { return b[item] - a[item]; },
                key: uuidv4(),
            };
        }
        if (item === "Выкупили, шт.") {
            return {
                title: item,
                dataIndex: item,
                sorter: function (a, b) { return b[item] - a[item]; },
                key: uuidv4(),
            };
        }
        if (item === "К перечислению за товар, руб.") {
            return {
                title: item,
                dataIndex: item,
                sorter: function (a, b) { return b[item] - a[item]; },
                key: uuidv4(),
            };
        }
        if (item === "Текущий остаток, шт.") {
            return {
                title: item,
                dataIndex: item,
                sorter: function (a, b) { return b[item] - a[item]; },
                key: uuidv4(),
            };
        }
        return {
            title: item,
            dataIndex: item,
            key: uuidv4(),
        };
    });
    var columns2 = header.map(function (item) {
        if (item === "Артикул продавца") {
            return __assign({ title: item, dataIndex: item, key: uuidv4() }, getColumnSearchProps(item));
        }
        return {
            title: item,
            dataIndex: item,
            key: uuidv4(),
        };
    });
    // useEffect(() => {
    //   console.log("Fruit", searchText);
    // }, [searchText]);
    return (_jsxs("div", { children: [_jsx("h2", { children: "Upload Excel File" }), _jsx("input", { type: "file", onChange: handleFile }), _jsx(Table, { size: "small", loading: loading, columns: columns, dataSource: data, expandable: {
                    expandedRowRender: function (record) {
                        return (_jsx(Table, { columns: columns2, dataSource: record["Список дубликатов"], pagination: false }));
                    },
                    rowExpandable: function (record) { return record["Дубликаты"] !== 1; },
                }, expandRowByClick: true, pagination: {
                    position: ["topCenter"],
                    defaultPageSize: 100,
                    showQuickJumper: true,
                } })] }));
}
export default App;
