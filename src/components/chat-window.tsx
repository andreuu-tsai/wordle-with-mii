"use client";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Input } from "./ui/input";

export default function ChatWindow() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState([
    { role: "user", content: "Hello!" },
    { role: "agent", content: "Hey there! How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const inputLength = input.trim().length;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
            setMessages([...messages, { role: "user", content: input }]);
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
