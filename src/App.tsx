// import React from "react";
// import Table from "./views/TableBook";

import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import * as XLSX from "xlsx";

import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Upload } from "antd";

import Highlighter from "react-highlight-words";
// import { useRef, useState } from 'react';

function App() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [header, setHeader] = useState([]);
    const [isSort, setIsSort] = useState(true);

    const [searchAuthor, setSearchAuthor] = useState("");
    const [searchSeries, setSearchSeries] = useState("");
    const [inputFocus, setInputFocus] = useState("Бренд");
    const [filterFocus, setFilterFocus] = useState("");

    const handleLoadingChange = () => {
        console.log(loading);
    };

    // useEffect(() => {
    //     console.log("loading", loading);
    // }, [loading]);

    const handleInputAuthor = (e: any) => {
        setInputFocus("Автор");
        setFilterFocus(e.target.value);
        setSearchAuthor(e.target.value);
    };

    const handleInputSeries = (e: any) => {
        setInputFocus("Серия");
        setFilterFocus(e.target.value);
        setSearchSeries(e.target.value);
    };

    const mySort = (arr: any) => {
        const wow = arr.sort((a: any, b: any) => {
            if (a["Бренд"] < b["Бренд"]) {
                return -1;
            }
            if (a["Бренд"] > b["Бренд"]) {
                return 1;
            }
            return 0;
        });

        const wow2 = wow.sort((a: any, b: any) => {
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
        const wow3 = wow2.sort((a: any, b: any) => {
            if (
                a["Бренд"] === b["Бренд"] &&
                a["Наименование"] === b["Наименование"]
            ) {
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

    function myGroup(array: any) {
        const myArr: any = [];
        const myObj: any = {};

        for (var i = 0; i < array.length; i++) {
            let brand =
                array[i]["Бренд"] + array[i]["Наименование"] + array[i]["Год"];

            if (myObj[brand]) {
                myObj[brand].push(array[i]);
            } else {
                myObj[brand] = [array[i]];
            }
        }

        for (let value of (Object as any).values(myObj)) {
            myArr.push({
                ["Бренд"]: value[0]["Бренд"],
                ["Наименование"]: value[0]["Наименование"],
                ["Год"]: value[0]["Год"],
                ["Автор"]: value[0]["Автор"],
                ["Серия"]: value[0]["Серия"],
                ["Языки"]: value[0]["Языки"],
                ["Артикул продавца"]: value[0]["Артикул продавца"],
                ["Заказали шт."]: value[0]["Заказали шт."],
                ["Поступления шт."]: value.reduce(
                    (res: any, val: any) => res + val["Поступления шт."],
                    0
                ),
                ["Выкупили, шт."]: value.reduce(
                    (res: any, val: any) => res + val["Выкупили, шт."],
                    0
                ),
                ["Сумма заказов минус комиссия WB, руб."]: value
                    .reduce(
                        (res: any, val: any) =>
                            res + val["Сумма заказов минус комиссия WB, руб."],
                        0
                    )
                    .toFixed(2),
                ["Текущий остаток, шт."]: value.reduce(
                    (res: any, val: any) => res + val["Текущий остаток, шт."],
                    0
                ),
                ["К перечислению за товар, руб."]: value
                    .reduce(
                        (res: any, val: any) =>
                            res + val["К перечислению за товар, руб."],
                        0
                    )
                    .toFixed(2),
                ["Список дубликатов"]: value,
                ["Дубликаты"]: value.length,
                ["Предмет"]: value[0]["Предмет"],
                key: uuidv4(),
            });
        }
        return myArr;
    }

    const handleFile = (e: any) => {
        e.preventDefault();

        const files = e.target.files;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onloadstart = () => {
                // console.log("start");
                setLoading(true);
            };
            reader.onloadend = () => {
                // console.log("end");
                setLoading(false);
            };
            reader.onload = (e) => {
                if (e.target) {
                    const bstr = e.target.result;
                    const wb = XLSX.read(bstr, { type: "binary" });
                    const sheetName = wb.SheetNames[0];
                    const ws = wb.Sheets[sheetName];
                    const headerTable: any = XLSX.utils.sheet_to_json(ws, {
                        header: 1,
                    })[0];
                    const dataTable = XLSX.utils.sheet_to_json(ws, {
                        header: 2,
                    });

                    const headerTableNew: any = ["Дубликаты"].concat([
                        ...headerTable,
                    ]);

                    const newDataTable = myGroup(mySort(dataTable));

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

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef<any>(null);

    const handleSearch = (selectedKeys: string[], dataIndex: any) => {
        // console.log('МММММММММ',searchText, searchedColumn, searchInput);
        // confirm();
        // console.log("selectedKeys", selectedKeys);

        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText("");
    };

    const getColumnSearchProps = (dataIndex: any) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }: any) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={(el) => {
                        // console.log('REFFF',el);
                        searchInput.current = el;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => {
                        console.log(selectedKeys);

                        // setSearchText(selectedKeys[0])
                        setSelectedKeys(e.target.value ? [e.target.value] : []);
                    }}
                    onPressEnter={() => confirm()}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    {/* <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button> */}
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined
                style={{ color: filtered ? "#1890ff" : undefined }}
            />
        ),
        onFilter: (value: any, record: any) => {
            console.log("record", record[dataIndex], value);
            return record[dataIndex]
                ?.toString()
                .toLowerCase()
                .includes((value as string).toLowerCase());
        },

        onFilterDropdownOpenChange: (visible: any) => {
            //   if (visible) {
            //     setTimeout(() => searchInput.current?.select(), 100);
            //   }
        },
        render: (text: any) => {
            return (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            );
        },
    });

    useEffect(() => {
        console.log("AAAAAAAA", searchText, searchedColumn, searchInput);
    }, [searchText, searchedColumn, searchInput]);

    // useEffect(() => {
    //     console.log('searchInput', searchInput);

    // }, [searchInput])

    const columns3 = [
        {
            title: "Дубликаты",
            dataIndex: "Дубликаты",
            sorter: (a: any, b: any) => a["Дубликаты"] - b["Дубликаты"],
            key: uuidv4(),
            // fixed: 'left',
        },
        {
            title: "Текущий остаток, шт.",
            dataIndex: "Текущий остаток, шт.",
            sorter: (a: any, b: any) =>
                a["Текущий остаток, шт."] - b["Текущий остаток, шт."],
            key: uuidv4(),
        },
        {
            title: "К перечислению за товар, руб.",
            dataIndex: "К перечислению за товар, руб.",
            sorter: (a: any, b: any) =>
                a["К перечислению за товар, руб."] -
                b["К перечислению за товар, руб."],
            key: uuidv4(),
        },
        {
            title: "Поступления шт.",
            dataIndex: "Поступления шт.",
            sorter: (a: any, b: any) =>
                a["Поступления шт."] - b["Поступления шт."],
            key: uuidv4(),
        },
        {
            title: "Выкупили, шт.",
            dataIndex: "Выкупили, шт.",
            sorter: (a: any, b: any) => a["Выкупили, шт."] - b["Выкупили, шт."],
            key: uuidv4(),
        },
        {
            title: "Заказали, шт.",
            dataIndex: "Заказали, шт.",
            sorter: (a: any, b: any) => a["Заказали, шт."] - b["Заказали, шт."],
            key: uuidv4(),
        },
        {
            title: "Сумма заказов минус комиссия WB, руб.",
            dataIndex: "Сумма заказов минус комиссия WB, руб.",
            sorter: (a: any, b: any) =>
                a["Сумма заказов минус комиссия WB, руб."] -
                b["Сумма заказов минус комиссия WB, руб."],
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

    const columns = header.map((item) => {
        if (item === "Дубликаты") {
            return {
                title: item,
                dataIndex: item,
                sorter: (a: any, b: any) => b[item] - a[item],
                key: uuidv4(),
            };
        }
        if (item === "Бренд") {
            return {
                title: item,
                dataIndex: item,
                key: uuidv4(),
                ...getColumnSearchProps(item),
            };
        }
        if (item === "Предмет") {
            return {
                title: item,
                dataIndex: item,
                filters: [
                    { text: "Книги", value: "Книги" },
                    { text: "Букинистика", value: "Букинистические книги" },
                ],
                onFilter: (value: any, record: any) =>
                    record[item].includes(value),
                key: uuidv4(),
            };
        }
        if (item === "Наименование") {
            return {
                title: item,
                dataIndex: item,
                key: uuidv4(),
                ...getColumnSearchProps(item),
            };
        }
        if (item === "Артикул продавца") {
            return {
                title: item,
                dataIndex: item,
                key: uuidv4(),
                ...getColumnSearchProps(item),
            };
        }
        if (item === "Автор") {
            return {
                title: item,
                dataIndex: item,
                key: uuidv4(),
                ...getColumnSearchProps(item),
            };
        }
        if (item === "Год") {
            return {
                title: item,
                dataIndex: item,
                key: uuidv4(),
                ...getColumnSearchProps(item),
            };
        }
        if (item === "Серия") {
            return {
                title: item,
                dataIndex: item,
                key: uuidv4(),
                ...getColumnSearchProps(item),
            };
        }
        if (item === "Поступления шт.") {
            return {
                title: item,
                dataIndex: item,
                sorter: (a: any, b: any) => b[item] - a[item],
                key: uuidv4(),
            };
        }
        if (item === "Заказали шт.") {
            return {
                title: item,
                dataIndex: item,
                sorter: (a: any, b: any) => b[item] - a[item],
                key: uuidv4(),
            };
        }
        if (item === "Сумма заказов минус комиссия WB, руб.") {
            return {
                title: item,
                dataIndex: item,
                sorter: (a: any, b: any) => b[item] - a[item],
                key: uuidv4(),
            };
        }
        if (item === "Выкупили, шт.") {
            return {
                title: item,
                dataIndex: item,
                sorter: (a: any, b: any) => b[item] - a[item],
                key: uuidv4(),
            };
        }
        if (item === "К перечислению за товар, руб.") {
            return {
                title: item,
                dataIndex: item,
                sorter: (a: any, b: any) => b[item] - a[item],
                key: uuidv4(),
            };
        }
        if (item === "Текущий остаток, шт.") {
            return {
                title: item,
                dataIndex: item,
                sorter: (a: any, b: any) => b[item] - a[item],
                key: uuidv4(),
            };
        }
        return {
            title: item,
            dataIndex: item,
            key: uuidv4(),
        };
    });

    const columns2 = header.map((item) => {
        if (item === "Артикул продавца") {
            return {
                title: item,
                dataIndex: item,
                key: uuidv4(),
                ...getColumnSearchProps(item),
            };
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

    return (
        <div>
            <h2>Upload Excel File</h2>
            <input type="file" onChange={handleFile} />
            <Table
                size="small"
                loading={loading}
                columns={columns}
                dataSource={data}
                expandable={{
                    expandedRowRender: (record) => {
                        return (
                            <Table
                                columns={columns2}
                                dataSource={record["Список дубликатов"]}
                                pagination={false}
                            />
                        );
                    },
                    rowExpandable: (record) => record["Дубликаты"] !== 1,
                }}
                expandRowByClick
                pagination={{
                    position: ["topCenter"],
                    defaultPageSize: 100,
                    showQuickJumper: true,
                }}
            />
            {/* {loading && (
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      )} */}
        </div>
    );
}

export default App;
