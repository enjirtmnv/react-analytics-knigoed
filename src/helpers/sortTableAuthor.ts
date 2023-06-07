export const sortTableAuthor = (arr: any) => {
    const arrSeries = arr.sort((a: any, b: any) => {
        if (a["Автор"] < b["Автор"]) {
            return -1;
        }
        if (a["Автор"] > b["Автор"]) {
            return 1;
        }
        return 0;
    });

    return arrSeries;
};