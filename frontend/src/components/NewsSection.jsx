import React, { useState } from 'react';
import { 
    Typography, 
    Button, 
    Box, 
    Card, 
    CardContent, 
    CardMedia, 
    Grid,
    Paper,
    Fade
} from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
// for the use of theme
import { useTheme } from '@mui/material/styles';
// note that, this is defined in the theme.js file and used appcontent file

const NewsSection = ({ news, loading = false }) => { 
    // state variable to show more news
    const [showMore, setShowMore] = useState(false);
    // for the use of theme
    const theme = useTheme();

    // if news is null, return a jsx element with a message
    if(!news || news.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                <Typography variant="h6" color="textSecondary">
                    No news available at the moment.
                </Typography>
            </Box>
            );
    }
    // if news is not empty, proceed to display the news   
    const visibleNews = showMore ? news : news.slice(0, 3);


    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                <Typography variant="h6" color="textSecondary">
                    Loading news...
                </Typography>
            </Box>
        );
    }

    return (
        <Paper 
            elevation={0} 
            sx={{ 
                p: 3, 
                backgroundColor: 'background.default',
                borderRadius: 3 
            }}
        >
            <Typography 
                variant="h4" 
                sx={{ 
                    mb: 4,
                    fontWeight: 600,
                    textAlign: 'center',
                    background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`,
                    backgroundClip: 'text',
                    color: 'transparent'
                }}
            >
                Latest News
            </Typography>

            {news.length === 0 ? (
                <Typography 
                    variant="body1" 
                    sx={{ 
                        textAlign: 'center', 
                        color: 'text.secondary',
                        fontStyle: 'italic'
                    }}
                >
                    No news available at the moment.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {visibleNews.map((article, index) => (
                        <Grid item xs={12} key={index}>
                            <Fade in={true} timeout={500 * (index + 1)}>
                                <Card 
                                    elevation={2}
                                    sx={{ 
                                        display: 'flex', 
                                        height: { xs: 'auto', sm: 250 },
                                        transition: 'all 0.3s ease',
                                        '&:hover': { 
                                            transform: 'translateY(-5px)', 
                                            boxShadow: 3 
                                        }
                                    }}
                                >
                                    {article.image && (
                                        <CardMedia
                                            component="img"
                                            sx={{ 
                                                width: { xs: 120, sm: 250 }, 
                                                flexShrink: 0,
                                                objectFit: 'cover'
                                            }}
                                            image={article.image}
                                            alt={article.title}
                                        />
                                    )}
                                    <CardContent 
                                        sx={{ 
                                            flex: 1, 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            p: 3
                                        }}
                                    >
                                        <Box 
                                            component="a" 
                                            href={article.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center',
                                                color: 'inherit',
                                                textDecoration: 'none',
                                                mb: 1
                                            }}
                                        >
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    fontWeight: 600, 
                                                    flexGrow: 1,
                                                    transition: 'color 0.2s',
                                                    '&:hover': { color: 'primary.main' }
                                                }}
                                            >
                                                {article.title}
                                            </Typography>
                                            <OpenInNew 
                                                color="action" 
                                                sx={{ ml: 1, fontSize: 18 }} 
                                            />
                                        </Box>
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                            sx={{ mb: 1 }}
                                        >
                                            {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
                                        </Typography>
                                        <Typography 
                                            variant="body1" 
                                            color="text.primary"
                                            sx={{ 
                                                overflow: 'hidden', 
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical'
                                            }}
                                        >
                                            {article.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>
            )}

            {news.length > 3 && (
                <Box display="flex" justifyContent="center" mt={3}>
                    <Button
                        onClick={() => setShowMore(!showMore)}
                        variant="contained"
                        color="primary"
                        sx={{
                            textTransform: 'none',
                            px: 4,
                            py: 1.5,
                            borderRadius: 3
                        }}
                    >
                        {showMore ? 'Show Less' : 'Show More'}
                    </Button>
                </Box>
            )}
        </Paper>
    );
};

export default NewsSection;