export function $id<T extends HTMLElement>(id: string) {
  return document.getElementById(id) as T;
}

export function $$id<T extends HTMLElement>(id: string) {
  return document.querySelectorAll<T>(`#${id.replace("#", "")}`);
}

export function $divById(id: string) {
  return $id<HTMLDivElement>(id);
}

export function $click(id: string, handler: () => void) {
  document.getElementById(id)!.onclick = handler
}

export const interfaceUrl = import.meta.env.VITE_INTERFACE_URL;
export const signalingServer = import.meta.env.VITE_SIGNALING_SERVER_URL;
