import { v4 as uuidv4 } from "uuid";

export const groupingTableAuthor = (array: any) => {
    const totalArr: any = [];
    const totalObj: any = {};

    for (let i = 0; i < array.length; i++) {
        let brand = array[i]["Автор"];

        if (totalObj[brand]) {
            totalObj[brand].push(array[i]);
        } else {
            totalObj[brand] = [array[i]];
        }
    }

    for (let value of (Object as any).values(totalObj)) {
        totalArr.push({
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
    return totalArr;
};
