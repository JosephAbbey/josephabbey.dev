import A from "./A";
import { NavigationMenu, NavigationMenuLink } from "./ui/navigation-menu";

export default function NavBar() {
  return (
    <NavigationMenu>
      <NavigationMenuLink asChild>
        <A href="/" data-astro-prefetch="hover">
          Projects
        </A>
      </NavigationMenuLink>
      <NavigationMenuLink asChild>
        <A href="/blog" data-astro-prefetch="hover">
          Blog
        </A>
      </NavigationMenuLink>
      <NavigationMenuLink asChild>
        <A href="/articles" data-astro-prefetch="hover">
          Articles
        </A>
      </NavigationMenuLink>
    </NavigationMenu>
  );
}
