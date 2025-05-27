import { useEffect } from "react";

/**
 * useLanguageSelector
 * Adds a change listener to the #lang-select element to switch locales.
 * Cleans up the event listener on unmount.
 */
export function useLanguageSelector() {
  useEffect(() => {
    const selector = document.getElementById("lang-select") as HTMLSelectElement | null;
    if (!selector) return;
    const handler = () => {
      const location = window.location;
      const url = location.href.replace(
        /built\/([a-z]{2}-[A-Z]{2})/,
        "built/" + selector.value
      );
      location.href = url;
    };
    selector.addEventListener("change", handler);
    return () => selector.removeEventListener("change", handler);
  }, []);
}