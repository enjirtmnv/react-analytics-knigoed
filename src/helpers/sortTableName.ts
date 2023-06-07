export const sortTableName = (arr: any) => {
    const arrName = arr.sort((a: any, b: any) => {
        if (a["Наименование"] < b["Наименование"]) {
            return -1;
        }
        if (a["Наименование"] > b["Наименование"]) {
            return 1;
        }
        return 0;
    });

    return arrName;
};
