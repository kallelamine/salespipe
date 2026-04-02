/** Innvotra — logo for in-app branding; tab icon uses /favicon.ico in index.html */
export const BRAND_LOGO_SRC = "/logoinnvotra.png";

type BrandLogoProps = {
  className?: string;
  alt?: string;
};

export function BrandLogo({ className, alt = "Innvotra" }: BrandLogoProps) {
  return <img src={BRAND_LOGO_SRC} alt={alt} className={className} loading="lazy" decoding="async" />;
}
