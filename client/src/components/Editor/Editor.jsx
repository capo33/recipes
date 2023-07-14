import ReactQuill from "react-quill";

import { formats, modules } from "../../utils";

const Editor = ({ recipe, onChange }) => {
  return (
    <>
      <p className='text-lg leading-6 font-medium'>Instructions</p>
      <ReactQuill
        value={recipe.instructions}
        onChange={onChange}
        theme='snow'
        style={{ border: "1px solid #e2e8f0" }}
        modules={modules}
        formats={formats}
        placeholder='Write something amazing...'
      />
    </>
  );
};

export default Editor;
