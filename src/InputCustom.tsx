import React from "react";

const InputCustom = (props: any) => {
    const { ref, title, value, handleChange, handleKeyDown } = props;
    console.log(ref)
    return (
        <input
            autoFocus={ref.current === document.activeElement}
            ref={ref}
            placeholder={`Введите ${title}`}
            value={value}
            onChange={(e) => handleChange(e)}
            onKeyDown={(e) => handleKeyDown(e, title)}
            style={{
                width: "150px",
                boxSizing: "border-box",
                padding: "4px 11px",
                lineHeight: "1.6",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                transition: "all 0.2s",
            }}
        />
    );
};

export default InputCustom;
