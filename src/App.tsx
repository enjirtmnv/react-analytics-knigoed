import React, { useEffect, useRef, useState, Key } from "react";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Upload, Tag } from "antd";
import { sortTableBrandNameYear } from "./helpers/sortTableBrandNameYear";
import { sortTableAuthor } from "./helpers/sortTableAuthor";
import { sortTableName } from "./helpers/sortTableName";
import { sortTableSeries } from "./helpers/sortTableSeries";
import { groupingTableBrandNameYear } from "./helpers/groupingTableBrandNameYear";
import { groupingTableName } from "./helpers/groupingTableName";
import { groupingTableSeries } from "./helpers/groupingTableSeries";
import { groupingTableAuthor } from "./helpers/groupingTableAuthor";
import { FilterDropdownProps } from "antd/es/table/interface";
import InputCustom from "./InputCustom";

function App() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [dataUpdate, setDataUpdate] = useState<any>([]);
    const [header, setHeader] = useState([]);
    const [mode, setMode] = useState("Бренд/Имя/Год");
    const [opa, setOpa] = useState(null);

    const [inputBrand, setInputBrand] = useState<string>("");
    const [inputName, setInputName] = useState<string>("");

    const yo = [];

    const removeIdFromDuplicate = (arr: any) => {
        return arr.reduce((res: any, val: any) => {
            return val["Дубликаты"] > 1
                ? [...res, { ...val, "Артикул продавца": "" }]
                : [...res, val];
        }, []);
    };

    const handleAuthor = () => {
        setData(
            removeIdFromDuplicate(
                groupingTableAuthor(sortTableAuthor(dataUpdate))
            )
        );
        setMode("Автор");
        setInputBrand("");
    };
    const handleName = () => {
        setData(
            removeIdFromDuplicate(groupingTableName(sortTableName(dataUpdate)))
        );
        setMode("Наименование");
        setInputBrand("");
    };
    const handleSeries = () => {
        setData(
            removeIdFromDuplicate(
                groupingTableSeries(sortTableSeries(dataUpdate))
            )
        );
        setMode("Серия");
        setInputBrand("");
    };
    const handleBrandNameYear = () => {
        setData(
            removeIdFromDuplicate(
                groupingTableBrandNameYear(sortTableBrandNameYear(dataUpdate))
            )
        );
        setMode("Бренд/Имя/Год");
        setInputBrand("");
    };

    const handleFile = (e: any) => {
        e.preventDefault();

        const files = e.target.files;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onloadstart = () => {
                setLoading(true);
            };
            reader.onloadend = () => {
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

                    setDataUpdate(dataTable);

                    const newDataTable = removeIdFromDuplicate(
                        groupingTableBrandNameYear(
                            sortTableBrandNameYear(dataTable)
                        )
                    );

                    setData(newDataTable);
                    setHeader(headerTableNew);
                }
            };
            reader.readAsBinaryString(files[0]);
        }
    };

    const searchInput = useRef<any>(null);
    const inputRef = useRef<any>(null);
    const inputRefName = useRef<any>(null);

    const filteringTable = (arr: any, dataIndex: any, value: any) => {
        const filterData = arr.filter((item: any) => {
            return item[dataIndex]
                ?.toString()
                .toLowerCase()
                .includes(value.toLowerCase());
        });

        if (mode === "Автор") {
            setData(
                removeIdFromDuplicate(
                    groupingTableAuthor(sortTableAuthor(filterData))
                )
            );
        }

        if (mode === "Наименование") {
            setData(
                removeIdFromDuplicate(
                    groupingTableName(sortTableName(filterData))
                )
            );
        }

        if (mode === "Серия") {
            setData(
                removeIdFromDuplicate(
                    groupingTableSeries(sortTableSeries(filterData))
                )
            );
        }

        if (mode === "Бренд/Имя/Год") {
            setData(
                removeIdFromDuplicate(
                    groupingTableBrandNameYear(
                        sortTableBrandNameYear(filterData)
                    )
                )
            );
        }
    };

    const getColumnSearch = (dataIndex: any) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }: FilterDropdownProps) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={(el) => (searchInput.current = el)}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => {
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
                        onClick={() => clearFilters && clearFilters()}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
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
            // setOpa(value)
            // console.log(opa,'||||',value, record )
            yo.push(record);
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
        render: (text: any) => text,
    });

    const handleChangeInputBrand = (e: any) => {
        setInputBrand(e.target.value);
    };
    const handleChangeInputName = (e: any) => {
        setInputName(e.target.value);
    };

    const handleKeyDownBrand = (e: any, item: any) => {
        if (e.key === "Enter") {
            filteringTable(dataUpdate, item, inputBrand);
            e.target.blur();
        }
    };
    const handleKeyDownName = (e: any, item: any) => {
        if (e.key === "Enter") {
            filteringTable(dataUpdate, item, inputName);
            e.target.blur();
        }
    };

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
                // title: (
                //     <>
                //         {item}
                //         <input
                //             autoFocus={
                //                 inputRef.current === document.activeElement
                //             }
                //             ref={inputRef}
                //             placeholder={`${item}`}
                //             value={inputBrand}
                //             onChange={(e) => handleChangeInputBrand(e)}
                //             onKeyDown={(e) => handleKeyDownBrand(e, item)}
                //             style={{
                //                 width: "150px",
                //                 boxSizing: "border-box",
                //                 padding: "4px 11px",
                //                 lineHeight: "1.6",
                //                 border: "1px solid #d9d9d9",
                //                 borderRadius: "6px",
                //                 transition: "all 0.2s",
                //             }}
                //         />
                //         <Button
                //             onClick={() =>
                //                 filteringTable(dataUpdate, item, inputBrand)
                //             }
                //         >
                //             Поиск
                //         </Button>
                //     </>
                // ),
                dataIndex: item,
                key: uuidv4(),
                ...getColumnSearch(item),
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
                ...getColumnSearch(item),
            };
        }
        if (item === "Артикул продавца") {
            return {
                title: item,
                dataIndex: item,
                key: uuidv4(),
                ...getColumnSearch(item),
            };
        }
        if (item === "Автор") {
            return {
                title: item,
                dataIndex: item,
                key: uuidv4(),
                ...getColumnSearch(item),
            };
        }
        if (item === "Год") {
            return {
                title: item,
                dataIndex: item,
                key: uuidv4(),
                ...getColumnSearch(item),
            };
        }
        if (item === "Серия") {
            return {
                title: item,
                dataIndex: item,
                key: uuidv4(),
                ...getColumnSearch(item),
            };
        }
        if (item === "Языки") {
            return {
                title: item,
                dataIndex: item,
                key: uuidv4(),
                ...getColumnSearch(item),
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

    const columnsNested = header.map((item) => {
        if (item === "Артикул продавца") {
            return {
                title: item,
                dataIndex: item,
                key: uuidv4(),
                ...getColumnSearch(item),
            };
        }
        return {
            title: item,
            dataIndex: item,
            key: uuidv4(),
        };
    });

    // const removeIdFromDuplicate2 = (arr: any) => {
    //     return arr.reduce((res: any, val: any) => {
    //         return val["Дубликаты"] > 1
    //             ? [...res, { ...val, "Артикул продавца": "" }]
    //             : [...res, val];
    //     }, []);
    // };

    const handleDownload = () => {
        let i = 0;
        const dataForDownload = data.reduce((res: any, val: any, index) => {
            if (val["Дубликаты"] > 1) {
                const duplicateID = val["Список дубликатов"]
                    .map((el: any) => el["Артикул продавца"])
                    .join(" ");
                i++;
                return (
                    res +
                    ` ${i}) "${val["Наименование"]}" "${val["Бренд"]}" ${val["Год"]} \n ${duplicateID} \n`
                );
            } else {
                return res;
            }
        }, "");

        console.log(dataForDownload);

        // Создаем данные, которые мы хотим записать в файл
        const newData = dataForDownload;

        // Создаем объект Blob из данных
        const blob = new Blob([newData], { type: "text/plain" });

        // Создаем объект URL из Blob
        const url = URL.createObjectURL(blob);

        // Создаем ссылку на скачивание файла
        const link = document.createElement("a");
        link.href = url;
        link.download = "example.txt";

        // Добавляем ссылку на страницу и нажимаем на нее
        document.body.appendChild(link);
        link.click();

        // Очищаем ссылку и объект URL
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <h2>Upload Excel File</h2>
            <input type="file" onChange={handleFile} />
            <Button
                style={{
                    margin: "8px",
                    backgroundColor: "#ffbf04",
                    color: "white",
                }}
                onClick={handleDownload}
            >
                Скачать артикулы дубликатов
            </Button>
            <span style={{ marginRight: "10px", marginLeft: "30px" }}>
                Выбранный фильтр:{" "}
                <span style={{ fontWeight: "bold" }}>{mode}</span>
            </span>
            <Button
                style={{
                    margin: "8px",
                    backgroundColor: "#00c5aa",
                    color: "white",
                }}
                onClick={handleBrandNameYear}
            >
                Бренд/Имя/Год
            </Button>
            <Button
                style={{
                    margin: "8px",
                    backgroundColor: "#4a77f1",
                    color: "white",
                }}
                type="primary"
                onClick={handleName}
            >
                Наименование
            </Button>
            <Button
                style={{
                    margin: "8px",
                    backgroundColor: "#894cff",
                    color: "white",
                }}
                onClick={handleAuthor}
            >
                Автор
            </Button>

            <Button
                style={{
                    margin: "8px",
                    backgroundColor: "#d647f4",
                    color: "white",
                }}
                type="primary"
                onClick={handleSeries}
            >
                Серия
            </Button>

            <Table
                size="small"
                loading={loading}
                columns={columns}
                dataSource={data}
                expandable={{
                    expandedRowRender: (record) => {
                        return (
                            <Table
                                columns={columnsNested}
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
                    showTotal: (total, range) => `Total ${total} items`,
                }}
            />
        </div>
    );
}

export default App;
