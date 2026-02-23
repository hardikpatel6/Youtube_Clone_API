export const timeAgo = (dateString) => {

  const now = new Date();
  const past = new Date(dateString);

  const seconds = Math.floor((now - past) / 1000);

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(seconds / 86400);
  const months = Math.floor(seconds / 2592000);
  const years = Math.floor(seconds / 31536000);

  if (years > 0)
    return `${years} year${years > 1 ? "s" : ""} ago`;

  if (months > 0)
    return `${months} month${months > 1 ? "s" : ""} ago`;

  if (days > 0)
    return `${days} day${days > 1 ? "s" : ""} ago`;

  if (hours > 0)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  if (minutes > 0)
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

  return "Just now";

};