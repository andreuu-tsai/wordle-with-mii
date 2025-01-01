"use client";
import { addMessage, getMessagesByUserId } from "@/lib/chat";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Input } from "./ui/input";

export default function ChatWindow({ userId }: { userId: number }) {
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const {
    isPending,
    isError,
    data: messages,
    error,
  } = useQuery({
    queryKey: ["messages", userId],
    queryFn: async () => getMessagesByUserId(userId),
    refetchInterval: 1000,
  });

  const { mutateAsync: submitMessage } = useMutation({
    mutationFn: async (content: string) => {
      try {
        await addMessage(userId, "user", content);
      } catch (error) {
        console.error("Error submitting message:", error);
        throw new Error("Failed to submit message. Please try again.");
      }
    },
    onMutate: async (content: string) => {
      const previousMessages = queryClient.getQueryData([
        "messages",
        userId,
      ]) as typeof messages;

      queryClient.setQueryData(
        ["messages", { userId }],
        (oldMessages?: typeof messages) => [
          ...(oldMessages || []),
          {
            id: 123, // Temporary ID
            userId,
            createdAt: Date.now(),
            role: "user",
            content,
          },
        ],
      );
      return { previousMessages };
    },
    onError: (error, content, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", userId],
          context.previousMessages,
        );
      }
      console.error("Error submitting message:", error);
      alert("Failed to send message. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", userId] });
    },
  });

  const [input, setInput] = useState("");
  const inputLength = input.trim().length;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isPending) return;
  if (isError) {
    console.error(error);
    return;
  }

  return (
    <Card className="fixed bottom-4 right-4 flex h-[480px] w-[350px] flex-col rounded-xl bg-gray-100 shadow-lg">
      <CardHeader className="flex h-14 flex-row items-center">
        <div className="flex items-center justify-center space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarImage
              className="rounded-full"
              src="/mii.png"
              alt="picture of mii"
            />
            <AvatarFallback>Mii</AvatarFallback>
          </Avatar>
          <p>Mii</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto bg-white p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                message.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted",
              )}
            >
              {message.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center p-2">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (inputLength === 0) return;
            submitMessage(input);
            setInput("");
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex items-center rounded-full"
            autoComplete="off"
            value={input}
            onKeyDown={(e) => e.stopPropagation()}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
          <Button type="submit" size="icon" disabled={inputLength === 0}>
            <Send />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
