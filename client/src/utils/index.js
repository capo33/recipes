// uper case first letter
export const uperCaseFirstLetter = (str) => {
  return str?.charAt(0).toUpperCase() + str?.slice(1);
};

// format date
export const formatDate = (date = Date.now() ) => {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1;
  const day = newDate.getDate();
  return `${day}/${month}/${year} `;
};

// sub string
export const subStringFunc = (str, length) => {
  if (str?.length > length) {
    return str.substring(0, length) + "...";
  } else {
    return str;
  }
};

// React quill editor
export const modules = {
  toolbar: [
    [{ header: [1, 2, false] }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
    ["code-block"],
  ],
};

export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "code-block",
];
