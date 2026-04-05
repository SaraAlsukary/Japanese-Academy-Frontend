import { useState } from "react";
export default function ReadMore({ children, maxWords = 191 }: { children: React.ReactNode, maxWords?: number }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // نحول children إلى نص لاستخراج الكلمات
    const getText = (node: any): string => {
        if (typeof node === "string") return node;
        if (Array.isArray(node)) return node.map(getText).join("");
        if (node?.props?.children) return getText(node.props.children);
        return "";
    };

    const fullText = getText(children);
    const words = fullText.split(" ");
    const isLong = words.length > maxWords;

    const shortText = words.slice(0, maxWords).join(" ");

    return (
        <p>
            {isExpanded || !isLong ? (
                children
            ) : (
                shortText + " "
            )}

            {isLong && (
                <div
                    className="read-more-btn"
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{ color: "#007bff", cursor: "pointer", fontWeight: "bold" }}
                >
                    {isExpanded ? " قراءة أقل" : " قراءة المزيد..."}
                </div>
            )}
        </p>
    );
}