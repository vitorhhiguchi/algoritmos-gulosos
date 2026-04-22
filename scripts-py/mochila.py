class Item:
    def __init__(self, valor, peso):
        self.valor = valor
        self.peso = peso
        self.razao = valor / peso # O coração do algoritmo guloso aqui

def mochila_fracionaria(capacidade, itens):
    # Ordena decrescente pela razão Valor/Peso
    itens.sort(key=lambda x: x.razao, reverse=True)
    
    valor_total = 0.0
    
    for item in itens:
        if capacidade >= item.peso:
            # Pega o item inteiro
            capacidade -= item.peso
            valor_total += item.valor
        else:
            # Pega só a fração que cabe
            fracao = capacidade / item.peso
            valor_total += item.valor * fracao
            break # A mochila encheu
            
    return valor_total

# Execução na apresentação
itens = [Item(60, 10), Item(100, 20), Item(120, 30)]
capacidade_mochila = 50
print(f"Valor máximo roubado: {mochila_fracionaria(capacidade_mochila, itens)}")