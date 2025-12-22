export async function uploadReport(file, fileHash, userId) {
  const formData = new FormData();
  formData.append("report", file);
  formData.append("fileHash", fileHash);
  formData.append("userId", userId);

  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/summarize`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Upload failed");
  }

  return data;
}
