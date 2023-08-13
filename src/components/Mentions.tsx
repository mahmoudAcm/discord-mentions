import { Box, ClickAwayListener, Container, CssBaseline, Paper, ThemeProvider } from '@mui/material';
import { theme } from '../theme';
import { KeyboardEvent, ReactNode, Ref, useCallback, useEffect, useRef, useState } from 'react';

interface onItemRenderProps {
  index: number;
  value: string;
  onClick: () => void;
  setItemRef: <T extends HTMLElement | null>(el: T) => void;
  props: {
    'data-value': string;
  };
}

interface childrenProps {
  inputRef: Ref<any> | undefined;
  onKeyDown: (evt: KeyboardEvent) => void;
  onClick: () => void;
  onChange: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

interface MentionsProps {
  data: string[];
  onItemRender: (props: onItemRenderProps) => ReactNode;
  children: (props: childrenProps) => ReactNode;
}

export default function Mentions(props: MentionsProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);
  const activeItemIndexRef = useRef(-1);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const lastAtPosRef = useRef(-1);
  const isInputFocused = useRef(false);
  const [pattern, setPattern] = useState('');

  const filteredData = props.data
    .filter(value => {
      if (pattern === '@') return true;
      return ('@' + value).includes(pattern);
    })
    .slice(0, 10);

  const isMenuOpen = !!(pattern && filteredData.length);

  itemsRef.current = new Array(filteredData.length).slice(0, 10).fill(null);

  const getCaretPosition = useCallback(() => {
    return inputRef.current?.selectionStart as number | undefined;
  }, []);

  const setCaretPosition = useCallback((position: number) => {
    inputRef.current?.setSelectionRange(position, position);
  }, []);

  const getSubstringStartsWithAt = useCallback(() => {
    if (lastAtPosRef.current === -1) return;

    const inputValue = inputRef.current?.value;
    return inputValue?.substring(lastAtPosRef.current, getCaretPosition());
  }, [getCaretPosition]);

  const getLastAtPost = useCallback(() => {
    return inputRef.current?.value.lastIndexOf('@', Math.max(0, getCaretPosition()!)) ?? -1;
  }, [getCaretPosition]);

  const removeFocusState = useCallback(() => {
    for (const item of itemsRef.current) {
      item?.classList.remove('Mui-focusVisible');
      item?.setAttribute('tabIndex', '-1');
    }
  }, []);

  const addActiveItemStyles = () => {
    if (activeItemIndexRef.current === -1) return;
    const item = itemsRef.current[activeItemIndexRef.current];

    item?.classList.add('Mui-focusVisible');
    item?.setAttribute('tabIndex', '0');
  };

  const addActiveClassToFirstItem = useCallback(() => {
    removeFocusState();
    activeItemIndexRef.current = 0;
    addActiveItemStyles();
  }, [removeFocusState]);

  const onMenuClickAway = useCallback(() => {
    lastAtPosRef.current = -1;
    activeItemIndexRef.current = 0;
    setPattern('');
    removeFocusState();
  }, [removeFocusState]);

  const onMenuMouseMove = useCallback(() => {
    removeFocusState();
    activeItemIndexRef.current = -1;
  }, [removeFocusState]);

  const handleItemClick = useCallback(
    (index: number) => () => {
      onItemSelect(index);
    },
    []
  );

  const onItemSelect = (index: number) => {
    const item = itemsRef.current[index];
    const value = item?.dataset.value;
    if (inputRef.current && lastAtPosRef.current !== -1 && !value) return;
    const input = inputRef.current!;

    const leftSide = input.value.substring(0, lastAtPosRef.current) + '@' + value + ' ';
    const rightSide = input.value.substring(getCaretPosition()!);

    input.value = leftSide + rightSide;

    lastAtPosRef.current = -1;
    setCaretPosition(leftSide.length);
    setPattern('');
    input.focus();
    activeItemIndexRef.current = -1;
  };

  const onMenuKeyDown = (evt: KeyboardEvent) => {
    lastAtPosRef.current = getLastAtPost();

    if (evt.key === 'ArrowUp' || evt.key === 'ArrowDown') {
      console.log('key down');
      evt.preventDefault();
      const itemsCount = filteredData.length;

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

  const onInputKeyDown = (evt: KeyboardEvent) => {
    lastAtPosRef.current = getLastAtPost();

    if (isMenuOpen && (evt.key === 'ArrowUp' || evt.key === 'ArrowDown')) {
      onMenuKeyDown(evt);
      return;
    }

    if (isMenuOpen && evt.key === 'Enter' && activeItemIndexRef.current !== -1 && !evt.shiftKey) {
      evt.preventDefault();
      onItemSelect(activeItemIndexRef.current);
      lastAtPosRef.current = -1;
      onMenuClickAway();
      return;
    }

    if (lastAtPosRef.current === -1) return;

    if (evt.key === 'ArrowLeft' || evt.key === 'ArrowRight') {
      const end = getCaretPosition() ?? lastAtPosRef.current + 1;
      const inputValue = inputRef.current?.value;
      const substring = inputValue?.substring(lastAtPosRef.current, end + (evt.key === 'ArrowLeft' ? -1 : 1));
      onPatternChange(substring ?? '');
    }
  };

  const onInputClick = () => {
    lastAtPosRef.current = getLastAtPost();
    if (!isInputFocused.current) return;

    const substring = getSubstringStartsWithAt();
    onPatternChange(substring ?? '');
  };

  const onInputChange = () => {
    lastAtPosRef.current = getLastAtPost();
    const substring = getSubstringStartsWithAt();
    onPatternChange(substring ?? '');
  };

  function onPatternChange(pattern: string) {
    addActiveClassToFirstItem();
    setPattern(pattern);
  }

  useEffect(() => {
    if (isMenuOpen) {
      addActiveClassToFirstItem();
    }
  }, [isMenuOpen]);

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
                  minHeight: '36px',
                  maxHeight: '379px',
                  overflow: 'auto',
                  borderRadius: '8px',
                  mb: '8px',
                  padding: '8px',
                  display: filteredData.length && pattern ? undefined : 'none'
                }}
                onMouseMove={onMenuMouseMove}
              >
                {filteredData.map((value, index) =>
                  props.onItemRender({
                    value,
                    index,
                    onClick: handleItemClick(index),
                    setItemRef: el => {
                      itemsRef.current[index] = el;
                    },
                    props: {
                      'data-value': value
                    }
                  })
                )}
              </Paper>
              {props.children({
                inputRef,
                onClick: onInputClick,
                onKeyDown: onInputKeyDown,
                onFocus: () => {
                  isInputFocused.current = true;
                },
                onBlur: () => {
                  isInputFocused.current = false;
                },
                onChange: onInputChange
              })}
            </Box>
          </ClickAwayListener>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
