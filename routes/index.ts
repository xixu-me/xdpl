import { defineHandler } from "nitro";

export default defineHandler(() => {
  return { nitro: "Is Awesome!" };
});
