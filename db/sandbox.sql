SELECT articles.*, COUNT(articles.article_id) FROM MESSAGE m
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.message;

