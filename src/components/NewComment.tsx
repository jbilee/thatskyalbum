import { ChangeEvent, useState } from "react";

type NewCommentProps = {
  handleComment: (input: string) => void;
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
      <button onClick={() => handleComment(comment)}>Comment</button>
    </div>
  );
}
