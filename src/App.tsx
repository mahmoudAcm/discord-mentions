import {
  Box,
  ClickAwayListener,
  Container,
  CssBaseline,
  InputBase,
  MenuItem,
  Paper,
  styled,
  ThemeProvider
} from '@mui/material';
import { theme } from './theme';
import { useRef, KeyboardEvent, useState } from 'react';

const StyledMenuItem = styled(MenuItem)(() => ({
  color: 'white',
  paddingInline: '11px',
  borderRadius: '3px',
  '&:hover,&.Mui-focusVisible': {
    background: '#35373c'
  }
}));

const size = 10;

export default function App() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const isMenuOpenedRef = useRef(true);
  const itemsRef = useRef<(HTMLElement | null)[]>(new Array(size).fill(null));
  const activeItemIndexRef = useRef(-1);
  const inputRef = useRef<HTMLInputElement | HTMLTemplateElement | null>(null);

  isMenuOpenedRef.current = isMenuOpen;

  const removeFocusState = () => {
    for (const item of itemsRef.current) {
      item?.classList.remove('Mui-focusVisible');
      item?.setAttribute('tabIndex', '-1');
    }
  };

  const addActiveItemStyles = () => {
    const item = itemsRef.current[activeItemIndexRef.current];

    item?.classList.add('Mui-focusVisible');
    item?.setAttribute('tabIndex', '0');
  };

  const onMenuClickAway = () => {
    isMenuOpenedRef.current = false;
    setMenuOpen(false);
  };

  const onMenuKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'ArrowUp' || evt.key === 'ArrowDown') {
      evt.preventDefault();
      const itemsCount = itemsRef.current.length;

      removeFocusState();

      if (evt.key === 'ArrowDown') {
        activeItemIndexRef.current++;
        if (activeItemIndexRef.current >= itemsCount) activeItemIndexRef.current = 0;
      } else {
        activeItemIndexRef.current--;
        if (activeItemIndexRef.current < 0) activeItemIndexRef.current = itemsCount - 1;
      }

      addActiveItemStyles();
    }
  };

  const onMenuMouseMove = () => {
    removeFocusState();
    activeItemIndexRef.current = -1;
  };

  const handleItemClick = (index: number) => () => {
    const item = itemsRef.current[index];
    console.log(item);

    setMenuOpen(false);
  };

  const onInputKeyDown = (evt: KeyboardEvent) => {
    if (isMenuOpenedRef.current && (evt.key === 'ArrowUp' || evt.key === 'ArrowDown')) {
      evt.preventDefault();
      onMenuKeyDown(evt);
      return;
    }

    if (isMenuOpenedRef.current && evt.key === 'Enter' && activeItemIndexRef.current !== -1) {
      evt.preventDefault();
      const item = itemsRef.current[activeItemIndexRef.current];
      console.log(item);
    }

    if (evt.key === '@') {
      removeFocusState();
      activeItemIndexRef.current = 0;
      addActiveItemStyles();
      setMenuOpen(true);
    } else {
      setMenuOpen(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box sx={{ height: '100vh', display: 'grid', alignItems: 'end', pb: '20px' }}>
          <ClickAwayListener onClickAway={onMenuClickAway}>
            <Box sx={{ position: 'relative' }}>
              <Paper
                role='menu'
                elevation={7}
                ref={menuRef}
                sx={{
                  left: 0,
                  right: 0,
                  bottom: '100%',
                  position: 'absolute',
                  background: '#2B2D31',
                  minHeight: '64px',
                  maxHeight: '379px',
                  overflow: 'auto',
                  borderRadius: '8px',
                  mb: '8px',
                  padding: '8px',
                  display: isMenuOpen ? undefined : 'none'
                }}
                onMouseMove={onMenuMouseMove}
              >
                {new Array(size).fill(0).map((_, index) => (
                  <StyledMenuItem
                    key={index}
                    ref={el => {
                      itemsRef.current[index] = el;
                    }}
                    onClick={handleItemClick(index)}
                  >
                    {index + 1}
                  </StyledMenuItem>
                ))}
              </Paper>

              <InputBase
                fullWidth
                multiline
                maxRows={17}
                placeholder='Message @MACM'
                inputRef={inputRef}
                onKeyDown={onInputKeyDown}
                sx={{
                  padding: '11px 16px',
                  borderRadius: '8px',
                  background: '#383A40',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: 15 / 16 + 'rem',
                  lineHeight: 22 / 15,
                  caretColor: 'currentColor',
                  '& input': {
                    padding: 0
                  }
                }}
              />
            </Box>
          </ClickAwayListener>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
