import { ChangeEvent, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

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
  return (
    <div>
      <textarea value={comment} onChange={handleInput} />
      <button onClick={() => handleComment(comment, setComment)}>Comment</button>
    </div>
  );
}
