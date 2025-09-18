import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { ScrollArea } from "./ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function ProjectCard({
  id,
  title,
  description,
  languages,
  contributors,
  icon,
  repository,
}: {
  id: string;
  title: string;
  description: string;
  languages: string[];
  contributors: string[];
  icon: string | null | undefined;
  repository: string | null | undefined;
}) {
  return (
    <Card className="hover:border-primary relative flex aspect-square min-w-60 justify-center rounded-xl border-2 p-2 transition-colors">
      <HoverCard>
        <HoverCardTrigger asChild>
          <h3
            style={{ viewTransitionName: `${id} title` }}
            className="scroll-m-20 overflow-hidden text-center text-2xl font-semibold tracking-tight overflow-ellipsis"
          >
            {title}
          </h3>
        </HoverCardTrigger>
        <HoverCardContent side="top" className="w-80">
          {description}
        </HoverCardContent>
      </HoverCard>
      <Badge className="absolute bottom-2 left-2">{languages[0]}</Badge>
      {contributors.length > 3 ? (
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="absolute right-2 bottom-2 flex -space-x-2 *:data-[slot=avatar]:ring-2">
              {contributors
                .slice(0, 2)
                .toReversed()
                .map((contributor) => (
                  <Avatar key={contributor}>
                    <AvatarImage
                      src={`https://github.com/${contributor}.png`}
                      alt={"@" + contributor}
                    />
                    <AvatarFallback>
                      {contributor.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              <Avatar>
                <AvatarFallback>+{contributors.length - 2}</AvatarFallback>
              </Avatar>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 pr-0">
            <ScrollArea className="h-32">
              <div className="flex flex-col gap-2">
                {contributors.map((contributor) => (
                  <div key={contributor} className="mr-4 flex justify-between">
                    <Avatar>
                      <AvatarImage
                        src={`https://github.com/${contributor}.png`}
                        alt={"@" + contributor}
                      />
                      <AvatarFallback>
                        {contributor.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="text-sm font-semibold">{contributor}</h4>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </HoverCardContent>
        </HoverCard>
      ) : (
        <div className="absolute right-2 bottom-2 flex -space-x-2 *:data-[slot=avatar]:ring-2">
          {contributors.toReversed().map((contributor) => (
            <Tooltip key={contributor}>
              <TooltipTrigger>
                <Avatar>
                  <AvatarImage
                    src={`https://github.com/${contributor}.png`}
                    alt={"@" + contributor}
                  />
                  <AvatarFallback>
                    {contributor.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="bottom">@{contributor}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}
    </Card>
  );
}
