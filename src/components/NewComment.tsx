import { ChangeEvent, useState } from "react";
import type { Dispatch, KeyboardEvent, SetStateAction } from "react";

type NewCommentProps = {
  handleComment: (input: string, callback: Dispatch<SetStateAction<string>>) => void;
};

export default function NewComment({ handleComment }: NewCommentProps) {
  const [comment, setComment] = useState("");

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    if (input.length > 100) return;
    setComment(input);
  };

  const handleCtrlEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === "Enter") return handleComment(comment, setComment);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleComment(comment, setComment);
      }}
    >
      <textarea value={comment} onChange={handleInput} onKeyDown={handleCtrlEnter} />
      <input type="submit" value="Comment" />
    </form>
  );
}
