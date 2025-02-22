import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./MarkdownRenderer.css"; // Import the CSS file

// Component to render the recipe as UI elements
const RecipeUI = ({ recipe }) => {
  return (
    <div className="recipe-ui">
      <h2>{recipe.recipeName}</h2>
      <p>{recipe.description}</p>
      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>
            <strong>{ingredient.item}</strong>: {ingredient.quantity}
            {ingredient.unit ? ` ${ingredient.unit}` : ""}
            {ingredient.form ? ` (${ingredient.form})` : ""}
          </li>
        ))}
      </ul>
      <h3>Instructions</h3>
      <ol>
        {recipe.instructions.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
      {recipe.servingSuggestions && recipe.servingSuggestions.length > 0 && (
        <>
          <h3>Serving Suggestions</h3>
          <ul>
            {recipe.servingSuggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

// MarkdownRenderer component which renders markdown content.
// If a code block is of language "json", it parses and renders as UI elements.
const MarkdownRenderer = ({ markdownContent }) => {
  return (
    <div className="markdown-renderer">
      <ReactMarkdown
        children={markdownContent}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            if (!inline && match) {
              if (match[1] === "json") {
                try {
                  // Remove trailing newline if present
                  const jsonContent = String(children).replace(/\n$/, "");
                  const recipe = JSON.parse(jsonContent);
                  return <RecipeUI recipe={recipe} />;
                } catch (e) {
                  // If parsing fails, fall back to a preformatted block
                  return <pre>{String(children)}</pre>;
                }
              } else {
                // Render other code blocks with syntax highlighting
                return (
                  <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                );
              }
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
};

export default MarkdownRenderer;
