import Markdown from "markdown-to-jsx";

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="bg-black p-4 rounded-lg max-w-full">
      <Markdown>{content}</Markdown>
    </div>
  );
};

export default MarkdownRenderer;
