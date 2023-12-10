/**
 * Default navigation button
 * @param args href of the location clicking to, text for the display text
 * @returns A navigation button
 */
export default function NavButton({
    href,
    text,
}: {
    href: string;
    text: string;
}) {
    return (
        <a
            className="hover:text-neutral-300 active:text-neutral-400 focus:text-neutral-300"
            href={href}
        >
            {text}
        </a>
    );
}
