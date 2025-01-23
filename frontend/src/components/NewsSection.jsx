import React, { useState, useEffect } from 'react';
import { 
    Typography, 
    Button, 
    Box, 
    Card, 
    CardContent, 
    CardMedia, 
    CircularProgress, 
    Link 
} from '@mui/material';
import newsService from '../services/newsService'; 

const NewsSection = ({ news }) => {
    const [showMore, setShowMore] = useState(false); 

    const visibleNews = showMore ? news.slice(0, 10) : news.slice(0, 3);

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
                Latest News 
            </Typography>

            {news.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                    No news available.
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {visibleNews.map((article, index) => (
                        <Card 
                            key={index} 
                            sx={{ 
                                display: 'flex', 
                                height: 200, 
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'scale(1.02)' }
                            }}
                        >
                            {article.image && (
                                <CardMedia
                                    component="img"
                                    sx={{ width: 200, objectFit: 'cover' }}
                                    image={article.image}
                                    alt={article.title}
                                />
                            )}
                            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <Link 
                                    href={article.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    sx={{ 
                                        color: 'primary.main', 
                                        textDecoration: 'none',
                                        '&:hover': { textDecoration: 'underline' }
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {article.title}
                                    </Typography>
                                </Link>
                                <Typography variant="body2" color="text.secondary">
                                    {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {article.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}

                    {news.length > 3 && (
                        <Button
                            onClick={() => setShowMore(!showMore)}
                            variant="contained"
                            color="primary"
                            sx={{
                                display: 'block',
                                margin: '1rem auto 0',
                                textTransform: 'capitalize',
                            }}
                        >
                            {showMore ? 'Show Less' : 'Show More'}
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default NewsSection;