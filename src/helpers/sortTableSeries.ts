export const sortTableSeries = (arr: any) => {
    const arrSeries = arr.sort((a: any, b: any) => {
        if (a["Серия"] < b["Серия"]) {
            return -1;
        }
        if (a["Серия"] > b["Серия"]) {
            return 1;
        }
        return 0;
    });

    return arrSeries;
};