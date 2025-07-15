"use client";

import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function PostDetail() {
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const params = useParams();
  const { id } = params;
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const fetchData = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    setPost(data);
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", id);
    setComments(data);
  };

  useEffect(() => {
    fetchData();
    fetchComments();
    setIsLoading(false);
  }, []);

  const handleDelete = async () => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      alert(error.message);
    } else {
      alert("게시글 삭제 성공");
      router.push("/posts");
    }
  };

  const handleCommentDelete = async (id: string) => {
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) {
      alert(error.message);
    } else {
      alert("댓글 삭제 성공");
      router.refresh();
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>{id}번</h1>
      <div className="text-2xl">{post.title}</div>
      <p>{post.content}</p>
      <button onClick={handleDelete}>삭제</button>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} className="text-xs underline">
            {comment.content}
            <button onClick={() => handleCommentDelete(comment.id)}>x</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default PostDetail;
