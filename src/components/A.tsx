import { navigate } from "astro:transitions/client";

export default function A(props: React.ComponentProps<"a">) {
  return (
    <a
      {...props}
      onClick={props.href ? () => navigate(props.href!) : undefined}
    />
  );
}
