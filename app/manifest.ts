import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Credible - Global News",
    short_name: "The Credible",
    description: "Real-time global news platform",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/credible_icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/credible_icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/credible_icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/credible_icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
