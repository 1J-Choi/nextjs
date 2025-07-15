"use client";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase
      .from("posts")
      .insert({
        title,
        content,
        user_id: user?.id,
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
    } else {
      alert("게시글 등록 성공");
      router.push(`/posts`);
    }
  };

  return (
    <>
      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
        />
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용"
        />
        <button type="submit">게시글 등록</button>
      </form>
    </>
  );
}

export default CreatePost;
