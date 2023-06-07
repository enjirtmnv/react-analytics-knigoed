export const sortTableBrandNameYear = (arr: any) => {
    const arrBrand = arr.sort((a: any, b: any) => {
        if (a["Бренд"] < b["Бренд"]) {
            return -1;
        }
        if (a["Бренд"] > b["Бренд"]) {
            return 1;
        }
        return 0;
    });

    const arrBrandName = arrBrand.sort((a: any, b: any) => {
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
    const arrBrandNameYear = arrBrandName.sort((a: any, b: any) => {
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
    return arrBrandNameYear;
};