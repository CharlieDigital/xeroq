export function $id<T extends HTMLElement>(id: string) {
  return document.getElementById(id) as T;
}

export function $$id<T extends HTMLElement>(id: string) {
  return document.querySelectorAll<T>(`#${id.replace("#", "")}`);
}

export function $divById(id: string) {
  return $id<HTMLDivElement>(id);
}
