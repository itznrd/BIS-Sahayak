"""
chat.py
Interactive CLI for the BIS assistant prototype.

Usage:
    python ingest.py      # build the index once (or after changing sample docs)
    python chat.py        # start the chat loop

Commands inside the chat:
    /sources   toggle showing retrieved source chunks under each answer
    /k <n>     change how many chunks are retrieved per query (default 3)
    /exit      quit
"""

import os
from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown

from retrieve import get_retriever
from generate import generate_answer
from config import GROQ_API_KEY

console = Console()


def print_banner(retriever_mode):
    console.print(Panel.fit(
        "[bold cyan]BIS Standards Assistant[/bold cyan] -- CLI Prototype\n"
        "[dim]Sample/illustrative knowledge base for demo purposes only.[/dim]\n"
        f"[dim]Retriever: {retriever_mode}  |  LLM: {'Groq' if GROQ_API_KEY else 'off (set GROQ_API_KEY)'}[/dim]",
        border_style="cyan",
    ))
    console.print("Type your question, or [bold]/exit[/bold] to quit. [bold]/sources[/bold] toggles citations view.\n")


def main():
    try:
        retriever = get_retriever()
    except FileNotFoundError as e:
        console.print(f"[bold red]{e}[/bold red]")
        return

    print_banner(retriever.mode)

    show_sources = True
    top_k = 3

    while True:
        try:
            query = console.input("[bold green]You:[/bold green] ").strip()
        except (EOFError, KeyboardInterrupt):
            console.print("\nGoodbye!")
            break

        if not query:
            continue

        if query.lower() in ("/exit", "/quit"):
            console.print("Goodbye!")
            break

        if query.lower() == "/sources":
            show_sources = not show_sources
            console.print(f"[dim]Source view: {'ON' if show_sources else 'OFF'}[/dim]\n")
            continue

        if query.lower().startswith("/k "):
            try:
                top_k = int(query.split()[1])
                console.print(f"[dim]Retrieving top {top_k} chunks per query.[/dim]\n")
            except (IndexError, ValueError):
                console.print("[dim]Usage: /k <number>[/dim]\n")
            continue

        chunks = retriever.retrieve(query, k=top_k)
        answer = generate_answer(query, chunks)

        console.print("\n[bold blue]Assistant:[/bold blue]")
        console.print(Markdown(answer))

        if show_sources:
            if chunks:
                console.print("\n[dim]Retrieved sources:[/dim]")
                for c in chunks:
                    console.print(f"  [dim]- {c['source']} (chunk #{c['chunk_id']}, score {c['score']})[/dim]")
            else:
                console.print("\n[dim]No matching chunks found above the relevance threshold.[/dim]")

        console.print()


if __name__ == "__main__":
    main()
