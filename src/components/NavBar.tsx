import { NavigationMenu, NavigationMenuLink } from "./ui/navigation-menu";

export default function NavBar() {
  return (
    <NavigationMenu className="absolute top-2">
      <NavigationMenuLink href="/" data-astro-prefetch="hover">
        Projects
      </NavigationMenuLink>
      <NavigationMenuLink href="/blog" data-astro-prefetch="hover">
        Blog
      </NavigationMenuLink>
      <NavigationMenuLink href="/articles" data-astro-prefetch="hover">
        Articles
      </NavigationMenuLink>
    </NavigationMenu>
  );
}
