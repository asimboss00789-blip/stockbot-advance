async function UserOrLogin() {
  return (
    <>
      {/* Logo links to homepage */}
      <Link href="/">
        <span style={{ fontSize: '1.5rem' }}>👾</span> {/* Your small logo */}
      </Link>

      <div className="flex items-center font-semibold ml-4">
        <IconSeparator className="size-6 text-muted-foreground/50" />
        
        {/* StockBot text links to homepage */}
        <Link href="/">
          StockBot
        </Link>

        <IconSeparator className="size-6 text-muted-foreground/50" />
        
        {/* Start New Chat button links to homepage */}
        <Link href="/">
          <a
            className={cn(buttonVariants({ variant: 'ghost' }))}
            style={{ borderRadius: 0, color: '#F55036', padding: '4px' }}
          >
            <span className="flex">Start New Chat</span>
          </a>
        </Link>
      </div>
    </>
  )
}
